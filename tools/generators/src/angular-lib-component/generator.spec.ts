import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { angularLibComponentGenerator } from './generator';
import { AngularLibComponentGeneratorSchema } from './schema';

describe('angular-lib-component generator', () => {
  let tree: Tree;
  const options: AngularLibComponentGeneratorSchema = {
    name: 'test',
    path: 'something',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await angularLibComponentGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });

  // TODO: Add more tests
});
