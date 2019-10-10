const exec = require('./exec_async').execAsync;
const fs = require('fs');
const path = require('path');

async function setBranchVersionForContracts() {

  const getCurrentBranchCommand = `git branch | grep \\* | cut -d ' ' -f2`;

  const currentBranch = await exec(getCurrentBranchCommand);

  const sanitizedBranchVersion = currentBranch
    .replace('/', '~')
    .replace('\n', '');

  console.log(`Setting branch version ${sanitizedBranchVersion} for all layer packages`);

  setPersistenceApiContractsBranchVersionForPackage('persistence_api.repositories.sequelize', sanitizedBranchVersion);
  setPersistenceApiContractsBranchVersionForPackage('persistence_api.services', sanitizedBranchVersion);
  setPersistenceApiContractsBranchVersionForPackage('persistence_api.use_cases', sanitizedBranchVersion);

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

setBranchVersionForContracts()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
