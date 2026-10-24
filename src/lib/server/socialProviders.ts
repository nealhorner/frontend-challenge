import { ENV } from 'varlock/env';

export type SocialProvider = 'github' | 'google';
type EnvSource = Record<string, unknown>;

type Credentials = { clientId: string; clientSecret: string };

const ENV_KEYS: Record<SocialProvider, [id: string, secret: string]> = {
  github: ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'],
  google: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']
};

/**
 * OAuth credentials for each social provider that has both its client ID and
 * secret set. Providers without credentials are left out, so local dev works
 * without OAuth apps and the sign-in page doesn't offer buttons that can't work.
 */
export function getSocialProviderCredentials(
  source: EnvSource = ENV
): Partial<Record<SocialProvider, Credentials>> {
  const configured: Partial<Record<SocialProvider, Credentials>> = {};
  for (const [provider, [idKey, secretKey]] of Object.entries(ENV_KEYS) as [
    SocialProvider,
    [string, string]
  ][]) {
    const clientId = source[idKey];
    const clientSecret = source[secretKey];
    if (
      typeof clientId === 'string' &&
      clientId &&
      typeof clientSecret === 'string' &&
      clientSecret
    ) {
      configured[provider] = { clientId, clientSecret };
    }
  }
  return configured;
}

/** Names of the social providers that are configured. */
export function getEnabledSocialProviders(source: EnvSource = ENV): SocialProvider[] {
  return Object.keys(getSocialProviderCredentials(source)) as SocialProvider[];
}
