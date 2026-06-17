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
import { sendEmail } from '$lib/server/email';

// Mirror the Argon2 parameters the app used before the BetterAuth migration so
// legacy password hashes (migrated into Account.password) keep verifying.
const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1
} as const;

function createAuth() {
  return betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),

    // Rate limiting is on by default in production. It is disabled only for the
    // e2e suite (AUTH_DISABLE_RATE_LIMIT=true), which exercises the auth flows
    // with many rapid sign-ups/sign-ins that would otherwise be throttled.
    rateLimit: {
      enabled: process.env.AUTH_DISABLE_RATE_LIMIT !== 'true'
    },

    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: 'Verify your Frontend Challenge email',
          html: `
            <p>Hi ${user.name},</p>
            <p>Click the link below to verify your email address. The link expires in 1 hour.</p>
            <p><a href="${url}">Verify my email</a></p>
            <p>If you didn't create an account, you can ignore this email.</p>
          `
        });
      },
      // Skipped in e2e tests via REQUIRE_EMAIL_VERIFICATION=false so the suite
      // can register + sign in without a real email provider.
      sendOnSignUp: process.env.REQUIRE_EMAIL_VERIFICATION !== 'false',
      autoSignInAfterVerification: true
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION !== 'false',
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
            // Don't let a secondary-record failure break account creation; log
            // it instead (mirrors the onLinkAccount handling below).
            try {
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
            } catch (error) {
              console.error('Failed to create UserStats/UserDetail for user', user.id, error);
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
          throw new APIError('BAD_REQUEST', {
            message: nameResult.invalidReason ?? 'Invalid name'
          });
        }
      })
    },

    plugins: [
      anonymous({
        // When an anonymous (guest) user links a real account, move their quizzes
        // and stats over using the existing migration helper. Failure here must
        // not break the sign-up/sign-in that triggered the link.
        onLinkAccount: async ({ anonymousUser, newUser }) => {
          try {
            await migrateGuestToUser(anonymousUser.user.id, newUser.user.id);
          } catch (error) {
            console.error('Failed to migrate guest data on account link:', error);
          }
        }
      }),
      // Must stay last so it can attach Set-Cookie headers in SvelteKit actions.
      sveltekitCookies(getRequestEvent)
    ]
  });
}

type AuthInstance = ReturnType<typeof createAuth>;

// Initialize BetterAuth lazily on first use. betterAuth() throws in production
// when BETTER_AUTH_SECRET is unset; deferring init keeps that out of the build
// (e.g. prerendering the home page) while still enforcing the secret at runtime.
let _auth: AuthInstance | undefined;
export const auth = new Proxy({} as AuthInstance, {
  get(_target, prop, receiver) {
    _auth ??= createAuth();
    return Reflect.get(_auth, prop, receiver);
  }
});

export type Auth = AuthInstance;
export type SessionUser = AuthInstance['$Infer']['Session']['user'];
export type Session = AuthInstance['$Infer']['Session']['session'];
