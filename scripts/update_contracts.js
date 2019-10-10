const exec = require('./exec_async').execAsync;
const fs = require('fs');
const path = require('path');

const branchToNpmTagMap = {
  develop: 'alpha',
  beta: 'beta',
  master: 'latest',
};

console.log(`Command args: ${process.argv.join('\n')}`);

let pushImmediately = false;

// Note that this script will not work on Jenkins, because Jenkins Builds always checkout a commit, not a branch.
async function parseCommandLineArgs() {

  const branchNameArgument = process.argv.find((entry) => entry.startsWith('branch='));

  if (!branchNameArgument) {
    console.error('You must provide "branch=<master|develop|beta|feature>" as argument!');
    process.exit(1);
  }

  const branchName = branchNameArgument.split('=')[1];

  const branchNameIsInvalid = branchName !== 'develop' && branchName !== 'beta' && branchName !== 'master' && branchName !== 'feature';
  if (branchNameIsInvalid) {
    console.error('Value for "branch" must be either "develop", "beta", "master" or "feature"!');
    process.exit(1);
  }

  console.log(`Setting version from ${branchName} branch`);

  pushImmediately = process.argv.find((entry) => entry.startsWith('pushImmediately')) !== undefined;

  console.log(`Pushing changes immediately: ${pushImmediately}`);

  return Promise.resolve(branchName);
}

async function getVersionForBranchName(branchName) {

  const useBranchName = branchName === 'feature';
  if(useBranchName) {
    console.log(`Setting current feature branch as version.`);
    return getVersionFromCurrentBranch();
  }

  const npmTagToUse = branchToNpmTagMap[branchName];

  console.log(`${branchName} is a main branch. Setting version from associated npm tag "${npmTagToUse}".`);

  return getVersionFromNpmTag(npmTagToUse);
}

async function getVersionFromCurrentBranch() {

  const currentBranch = await exec(`git branch | grep \\* | cut -d ' ' -f2`);

  const sanitizedBranchVersion = currentBranch
    .replace('/', '~')
    .replace('\n', '');

  const currentlyOnMainBranch = currentBranch === 'develop' || currentBranch === 'beta' || currentBranch === 'master';
  if (currentlyOnMainBranch) {
    console.error('Setting branch versions is not allowed for develop, beta or master!');
    process.exit(1);
  }

  console.log(`Setting branch version ${sanitizedBranchVersion} for all layer packages`);

  return sanitizedBranchVersion;
}

async function getVersionFromNpmTag(npmTag) {

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
    // await exec('git add */package.json');
    // await exec('git commit -m ":recycle: Set feature branch version for persistence_api.contracts"');

    // if (pushImmediately) {
    //   await exec('git push');
    // }
  } catch (error) {
    console.log('Failed to create commit. This likely means that the versions are already set and that there is nothing to commit.');
  }
}

parseCommandLineArgs()
  .then(getVersionForBranchName)
  .then(setContractsVersionInLayerPackages)
  .then(createCommit)
  .then(() => console.log('Done!'))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
