import { defineRailway, github, project, service } from 'railway/iac';
// This repository manages only its own resources in the environment. Other
// repositories export their own partial name.
// See https://docs.railway.com/infrastructure-as-code#multi-repo-projects
export const partial = 'frontend-challenge';
export default defineRailway((ctx) => {
  const frontendChallenge = service('frontend-challenge', {
    source: github('nealhorner/frontend-challenge', {
      branch: 'main',
      upstreamUrl: 'https://github.com/nealhorner/frontend-challenge'
    }),
    build: { buildCommand: 'npm run build', buildEnvironment: 'V3', builder: 'RAILPACK' },
    start: 'npm run start',
    healthcheck: '/',
    preDeploy: 'npm run predeploy',
    replicas: { sfo: 1 },
    // The custom domain belongs to production only; staging uses its Railway domain.
    ...(ctx.isEnvironment('production')
      ? { domains: ['frontendchallenge.dev'] }
      : // Staging already runs with raised container limits; keep them.
        { deploy: { limitOverride: { containers: { cpu: 2, memoryBytes: 4000000000 } } } })
  });

  return project('Frontend Challenge', {
    variables: { managed: false },
    resources: [frontendChallenge]
  });
});
