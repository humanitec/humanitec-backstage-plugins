# humanitec-backstage-plugins

> [!WARNING]
> The Humanitec Backstage plugin continues to work with Humanitec v1, but is no longer
> maintained. Of note, it is not compatible with v2.
>
> A Backstage plugin for Humanitec Platform Orchestrator (v2) is on our roadmap.

This repository contains [Backstage](https://backstage.io/) plugins to interact with the [Humanitec Platform Orchestrator](https://developer.humanitec.com/platform-orchestrator/overview/) from your Backstage Portal.

* [humanitec](./plugins/humanitec) Show workloads, environments and resources deployed by Humanitec Platform Orchestrator.
* [humanitec-backend](./plugins/humanitec-backend) Backend API route.
* [humanitec-backend-scaffolder-module](./plugins/humanitec-backend-scaffolder-module) Scaffolder actions.

## Development

To start the app, run:

```sh
yarn install
yarn dev
```

Execute the tests using:

```sh
yarn test
```

## Contributing

This repository is using [changesets](https://github.com/changesets/changesets) to control versioning and releases. Please run `yarn changeset` before opening a PR and include the generated changeset in your PR.
