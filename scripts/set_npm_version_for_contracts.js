const exec = require('./exec_async').execAsync;
const fs = require('fs');
const path = require('path');

console.log(`Command args: ${process.argv.join('\n')}`);

let pushImmediately = false;

// Note that this script will not work on Jenkins, because Jenkins Builds always checkout a commit, not a branch.
async function parseCommandLineArgs() {

  if (process.argv.length < 3) {
    console.error('You must provide a tag name as first argument!');
    process.exit(1);
  }

  npmTagToUse = process.argv[2];

  if (npmTagToUse !== 'alpha' && npmTagToUse !== 'beta' && npmTagToUse !== 'latest') {
    console.error('Tag name must be either "alpha", "beta" or "latest"!');
    process.exit(1);
  }

  console.log(`Setting version from npm tag: ${npmTagToUse}`);

  pushImmediately = process.argv.find((entry) => entry === 'pushImmediately') !== undefined;

  console.log(`Pushing changes immediately: ${pushImmediately}`);

  return Promise.resolve(npmTagToUse);
}

async function getVersionForNpmTag(npmTag) {

  const tagsAsString = await exec('npm dist-tag ls @process-engine/persistence_api.contracts');

  const tags = tagsAsString.split('\n');

  const matchingTag = tags.find((tag) => tag.startsWith(npmTag));

  if (!matchingTag) {
    console.error(`Tag "${npmTag}" does not exist!`);
    process.exit(1);
  }

  const version = matchingTag.split(':')[1].trim();

  console.log(`Current version for dist-tag "${npmTag}" is: ${version}`);

  return version;
}

async function setContractsVersionInLayerPackages(versionToUse) {

  console.log(`Setting @process-engine/persistence_api.contracts to ${versionToUse} for all layer packages`);

  setPersistenceApiContractsBranchVersionForPackage('persistence_api.repositories.sequelize', versionToUse);
  setPersistenceApiContractsBranchVersionForPackage('persistence_api.services', versionToUse);
  setPersistenceApiContractsBranchVersionForPackage('persistence_api.use_cases', versionToUse);
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

  console.log('Commiting everything');

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

parseCommandLineArgs()
  .then(getVersionForNpmTag)
  .then(setContractsVersionInLayerPackages)
  .then(createCommit)
  .then(() => console.log('Done!'))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
