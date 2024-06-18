import { Entity } from '@backstage/catalog-model';
import {
  hasHumanitecAnnotations,
  HumanitecCardComponent,
} from './HumanitecCardComponent';

import { EntityProvider } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { rootRouteRef } from '../routes';
import {
  configApiRef,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

let originalAppInfo = false;

jest.mock('../hooks/useAppInfo', () => ({
  useAppInfo: jest.fn((...args) => {
    if (originalAppInfo) {
      const { useAppInfo } = jest.requireActual('../hooks/useAppInfo');
      return useAppInfo(args[0]);
    }
    return [{}];
  }),
}));

describe('<HumanitecCardComponent />', () => {
  beforeEach(() => {
    originalAppInfo = false;
  });

  it('renders a warning without annotations', async () => {
    originalAppInfo = true;
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
        annotations: {},
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, {}],
          [discoveryApiRef, {}],
          [
            identityApiRef,
            {
              getCredentials: jest.fn().mockResolvedValue({}),
            },
          ],
        ]}
      >
        <EntityProvider entity={entity}>
          <HumanitecCardComponent />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );
    expect(
      screen.getByText(
        'No Humanitec annotations defined for this entity. You can add annotations to entity YAML as shown in the highlighted example below:',
      ),
    ).toBeInTheDocument();
  });

  it('renders never deployed environments', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'humanitec.com/orgId': 'orgId',
          'humanitec.com/appId': 'appId',
        },
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, {}],
          [
            discoveryApiRef,
            {
              getBaseUrl: jest
                .fn()
                .mockResolvedValue('https://app.humanitec.io'),
            },
          ],
          [
            identityApiRef,
            {
              getCredentials: jest.fn().mockResolvedValue({}),
            },
          ],
        ]}
      >
        <EntityProvider entity={entity}>
          <HumanitecCardComponent />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );
    expect(screen.getByText('Never deployed')).toBeInTheDocument();
  });

  it('returns hasHumanitecAnnotations truthy if the entity has humanitec annotations', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        annotations: {
          'humanitec.com/orgId': 'orgId',
          'humanitec.com/appId': 'appId',
        },
      },
    };

    const hasAnnotations = await hasHumanitecAnnotations(entity);

    expect(hasAnnotations).toBeTruthy();
  });

  it('returns hasHumanitecAnnotations falsy if the entity has no humanitec annotations', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
    };

    const hasAnnotations = await hasHumanitecAnnotations(entity);

    expect(hasAnnotations).toBeFalsy();
  });
});
