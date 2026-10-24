import { describe, expect, it } from 'vitest';
import { getEnabledSocialProviders, getSocialProviderCredentials } from './socialProviders';

describe('social providers', () => {
  it('enables a provider only when both its client ID and secret are set', () => {
    const env = { GITHUB_CLIENT_ID: 'gh-id', GITHUB_CLIENT_SECRET: 'gh-secret' };
    expect(getSocialProviderCredentials(env)).toEqual({
      github: { clientId: 'gh-id', clientSecret: 'gh-secret' }
    });
    expect(getEnabledSocialProviders(env)).toEqual(['github']);
  });

  it('leaves out a provider missing its secret', () => {
    expect(
      getEnabledSocialProviders({ GOOGLE_CLIENT_ID: 'g-id', GOOGLE_CLIENT_SECRET: '' })
    ).toEqual([]);
  });

  it('enables both when both are configured', () => {
    const env = {
      GITHUB_CLIENT_ID: 'gh-id',
      GITHUB_CLIENT_SECRET: 'gh-secret',
      GOOGLE_CLIENT_ID: 'g-id',
      GOOGLE_CLIENT_SECRET: 'g-secret'
    };
    expect(getEnabledSocialProviders(env)).toEqual(['github', 'google']);
  });
});
