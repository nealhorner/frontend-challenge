import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { anonymous } from 'better-auth/plugins';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { getRequestEvent } from '$app/server';
import { hash as argon2Hash, verify as argon2Verify } from '@node-rs/argon2';
import prisma from '$lib/prisma';
import { validateEmail, validateName, validatePassword } from '$lib/server/validation';
import { migrateGuestToUser } from '$lib/server/userGuest';

// Mirror the Argon2 parameters the app used before the BetterAuth migration so
// legacy password hashes (migrated into Account.password) keep verifying.
const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1
} as const;

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
    // Keep Argon2 hashing so pre-migration credentials still authenticate.
    password: {
      hash: (password) => argon2Hash(password, ARGON2_OPTIONS),
      verify: ({ hash, password }) => argon2Verify(hash, password, ARGON2_OPTIONS)
    }
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ''
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    }
  },

  // Every user (guest or real) needs a UserStats row for quiz tracking; real
  // users also get a UserDetail row (the profile page expects one). This
  // replaces the related-record creation the old createUserGuest/register did.
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.userStats.upsert({
            where: { userId: user.id },
            update: {},
            create: { userId: user.id }
          });

          if (!user.isAnonymous) {
            await prisma.userDetail.upsert({
              where: { userId: user.id },
              update: {},
              create: { userId: user.id }
            });
          }
        }
      }
    }
  },

  // Enforce the app's existing name/email/password rules on email sign-up by
  // reusing the validators in src/lib/server/validation.
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== '/sign-up/email') return;

      const { email, password, name } = ctx.body ?? {};

      const emailResult = validateEmail(email);
      if (!emailResult.isValid) {
        throw new APIError('BAD_REQUEST', {
          message: emailResult.invalidReason ?? 'Invalid email'
        });
      }

      const passwordResult = validatePassword(password ?? '');
      if (!passwordResult.isValid) {
        throw new APIError('BAD_REQUEST', {
          message: passwordResult.invalidReason ?? 'Invalid password'
        });
      }

      const nameResult = validateName(name ?? '');
      if (!nameResult.isValid) {
        throw new APIError('BAD_REQUEST', { message: nameResult.invalidReason ?? 'Invalid name' });
      }
    })
  },

  plugins: [
    anonymous({
      // When an anonymous (guest) user links a real account, move their quizzes
      // and stats over using the existing migration helper.
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await migrateGuestToUser(anonymousUser.user.id, newUser.user.id);
      }
    }),
    // Must stay last so it can attach Set-Cookie headers in SvelteKit actions.
    sveltekitCookies(getRequestEvent)
  ]
});

export type Auth = typeof auth;
export type SessionUser = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
