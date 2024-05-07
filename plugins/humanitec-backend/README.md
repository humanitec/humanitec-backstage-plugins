# @humanitec/backstage-plugin-backend

`@humanitec/backstage-plugin-backend` is a plugin for the Backstage backend app. It provides a route that `@humanitec/backstage-plugin` will use to connect to Humanitec API.

## Installation

1. Install `@humanitec/backstage-plugin-backend` plugin with,

```bash
yarn workspace backend add @humanitec/backstage-plugin-backend
```

1. Add the plugin in `./packages/backend/src/index.ts` to your backend,

```diff
+ backend.add(import('@humanitec/backstage-plugin-backend'));

backend.start();
```

1. Add configuration to `app-config.yaml`

```diff
humanitec:
  orgId: the-frontside-software-inc
  token: ${HUMANITEC_TOKEN}
```
