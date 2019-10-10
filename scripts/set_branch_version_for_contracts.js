const exec = require('./exec_async').execAsync;
const fs = require('fs');
const path = require('path');

// Note that this script will not work on Jenkins, because Jenkins Builds always checkout a commit, not a branch.
const pushImmediately = process.argv.length > 2 && process.argv[2] === 'pushImmediately';
console.log(`Command args: ${process.argv.join('\n')}`);

async function setBranchVersionForContracts() {

  const currentBranch = await exec(`git branch | grep \\* | cut -d ' ' -f2`);

  const sanitizedBranchVersion = currentBranch
    .replace('/', '~')
    .replace('\n', '');

  console.log(`Setting branch version ${sanitizedBranchVersion} for all layer packages`);

  setPersistenceApiContractsBranchVersionForPackage('persistence_api.repositories.sequelize', sanitizedBranchVersion);
  setPersistenceApiContractsBranchVersionForPackage('persistence_api.services', sanitizedBranchVersion);
  setPersistenceApiContractsBranchVersionForPackage('persistence_api.use_cases', sanitizedBranchVersion);

  console.log('Commiting everything');

  await createCommit();

  console.log('Done!');
}

function setPersistenceApiContractsBranchVersionForPackage(packageName, versionToSet) {

  console.log(`Setting @process-engine/persistence_api_contracts for pacakge ${packageName}`)

  const pathToPackageJson = path.resolve(packageName, 'package.json');

  const packageJsonAsString = fs.readFileSync(pathToPackageJson, 'utf-8');
  const packageJson = JSON.parse(packageJsonAsString);

  packageJson.dependencies['@process-engine/persistence_api.contracts'] = versionToSet;

  const stringifiedPackageJson = JSON.stringify(packageJson, null, '  ');

  fs.writeFileSync(pathToPackageJson, `${stringifiedPackageJson}\n`, 'utf-8');
}

async function createCommit() {
  try {
    await exec('git add */package.json');
    await exec('git commit -m ":recycle: Set feature branch version for persistence_api.contracts"');

    if (pushImmediately) {
      await exec('git push');
    }
  } catch (error) {
    console.log('Failed to create commit. This likely means that the versions are already set and that there is nothing to commit.');
  }
}

setBranchVersionForContracts()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
