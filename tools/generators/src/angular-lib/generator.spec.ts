import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { angularLibGenerator } from './generator';
import { AngularLibGeneratorSchema } from './schema';

describe('angular-lib generator', () => {
  let tree: Tree;
  const options: AngularLibGeneratorSchema = {
    name: 'test',
    path: 'something',
    createBaseComponent: true,
    createDataAccess: true,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await angularLibGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
