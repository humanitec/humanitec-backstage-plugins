# @humanitec/backstage-plugin-backend

`@humanitec/backstage-plugin-backend` is a plugin for the Backstage backend app. It provides a route that `@humanitec/backstage-plugin` will use to connect to Humanitec API.

## Installation

1. Install `@humanitec/backstage-plugin-backend` plugin with,

```bash
yarn workspace backend add @humanitec/backstage-plugin-backend
```

2. Create `./packages/backend/src/plugins/humanitec.ts` with the following content,

```ts
import { createRouter } from '@humanitec/backstage-plugin-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
  });
}
```

3. Add `humanitec` api route to `./packages/backend/src/index.ts`.

```diff
# Import humanitec plugin from `./plugins/humanitec.ts`
import search from './plugins/search';
+ import humanitec from './plugins/humanitec';

# Create Humanitec environment
const searchEnv = useHotMemoize(module, () => createEnv('search'));
+ const humanitecEnv = useHotMemoize(module, () => createEnv('humanitec'));

# Add Humanitec to the router
apiRouter.use('/search', await search(searchEnv));
+ apiRouter.use('/humanitec', await humanitec(humanitecEnv));
```

4. Add configuration to `app-config.yaml`

```diff
humanitec:
  orgId: the-frontside-software-inc
  token: ${HUMANITEC_TOKEN}
```
