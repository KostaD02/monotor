import { joinPathFragments, Tree } from '@nx/devkit';
import { libraryGenerator, UnitTestRunner } from '@nx/angular/generators';
import { AngularLibGeneratorSchema } from './schema';
import { Schema } from '@nx/angular/src/generators/library/schema';

export async function angularLibGenerator(
  tree: Tree,
  options: AngularLibGeneratorSchema,
) {
  const projectRoot = `libs/${options.path}`;
  const config: Schema = {
    name: options.name,
    simpleName: true,
    standalone: true,
    commonModule: false,
    prefix: 'monotor',
    style: 'less',
    changeDetection: 'OnPush',
    directory: `${projectRoot}/features`,
    importPath: `@monotor/${options.name}`,
    linter: 'eslint',
    unitTestRunner: UnitTestRunner.Jest,
    strict: true,
    flat: true,
  };
  if (options.createBaseComponent) {
    await libraryGenerator(tree, {
      ...config,
      importPath: `@monotor/${options.name}/feature/base`,
    });
  }
  if (options.createDataAccess) {
    await libraryGenerator(tree, {
      name: `data-access`,
      directory: projectRoot,
      importPath: `@monotor/${options.name}/data-access`,
    });

    const srcDataAccessPath = joinPathFragments(
      projectRoot,
      'data-access',
      'src',
    );

    const dataAccessLibPath = joinPathFragments(
      srcDataAccessPath,
      'lib',
      `${options.name}-data-access`,
    );

    if (tree.exists(dataAccessLibPath)) {
      tree.delete(dataAccessLibPath);
      tree.write(joinPathFragments(srcDataAccessPath, 'lib/index.ts'), '');
    }

    const indexFilePath = joinPathFragments(srcDataAccessPath, 'index.ts');
    if (tree.exists(indexFilePath)) {
      tree.write(indexFilePath, '');
    }
  }
  await libraryGenerator(tree, {
    name: 'shell',
    skipModule: true,
    simpleName: true,
    skipTests: true,
    linter: 'eslint',
    strict: true,
    prefix: 'monotor',
    directory: `${projectRoot}/features`,
    importPath: `@monotor/${options.name}/feature/shell`,
    unitTestRunner: UnitTestRunner.Jest,
    routing: true,
  });

  const srcShellPath = joinPathFragments(
    projectRoot,
    'features',
    'shell',
    'src',
  );

  const shellComponentDir = joinPathFragments(srcShellPath, 'lib/shell');

  if (tree.exists(shellComponentDir)) {
    tree.delete(shellComponentDir);
  }

  const routesPath = joinPathFragments(srcShellPath, 'lib/lib.routes.ts');

  if (tree.exists(routesPath)) {
    const updatedContent = `
import { Route } from '@angular/router';

export const ${options.name
      .toUpperCase()
      .split('')
      .map((char) => (char === '-' ? '_' : char))
      .join('')}_ROUTES: Route[] = [];
    `;

    tree.write(routesPath, updatedContent);
  }

  const indexFilePath = joinPathFragments(srcShellPath, 'index.ts');

  if (tree.exists(indexFilePath)) {
    tree.write(indexFilePath, `export * from './lib/lib.routes';`);
  }
}

export default angularLibGenerator;
