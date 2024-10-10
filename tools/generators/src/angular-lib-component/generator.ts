import { Tree } from '@nx/devkit';
import { AngularLibComponentGeneratorSchema } from './schema';
import { libraryGenerator, UnitTestRunner } from '@nx/angular/generators';

export async function angularLibComponentGenerator(
  tree: Tree,
  options: AngularLibComponentGeneratorSchema,
) {
  const projectRoot = `libs/${options.path}`;
  await libraryGenerator(tree, {
    name: options.name,
    simpleName: true,
    standalone: true,
    commonModule: false,
    prefix: 'monotor',
    style: 'less',
    changeDetection: 'OnPush',
    directory: projectRoot,
    importPath: `@monotor/${options.path}/${options.name}`,
    linter: 'eslint',
    unitTestRunner: UnitTestRunner.Jest,
    strict: true,
    flat: true,
  });
}

export default angularLibComponentGenerator;
