import * as fs from 'fs';
import * as path from 'path';

(async () => {
  const buildFile = await fs.promises.readFile(path.join(__dirname, '../build.gradle'), { encoding: 'utf8' });
  const version = /version '1.0.(\d+)'/.exec(buildFile)[1];
  const nextVersion = parseInt(version) + 1;
  const updatedBuildFile = buildFile.replace(new RegExp(`version '1.0.${version}'`), `version '1.0.${nextVersion}'`);
  await fs.promises.writeFile(path.join(__dirname, '../build.gradle'), updatedBuildFile);
})();