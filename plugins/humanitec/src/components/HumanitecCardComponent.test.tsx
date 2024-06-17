import { Entity } from '@backstage/catalog-model';
import { hasHumanitecAnnotations } from './HumanitecCardComponent';

describe('<HumanitecCardComponent />', () => {
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
