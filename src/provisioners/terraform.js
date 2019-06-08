const path = require('path');
const tmp = require('tmp');
const fs = require('fs');
const { flags } = require('@oclif/command');
const { execSync } = require('child_process');

const checkDependencies = () => {
  let tfVersion;

  try {
    /* eslint-disable prefer-destructuring */
    tfVersion = execSync('terraform --version').toString().split('\n')[0].split(' ')[1];
  } catch (ex) {
    throw new Error('Terraform must be installed to use safeguards');
  }

  if (tfVersion !== 'v0.12.0-beta2') {
    throw new Error('Safgeguards currently is only supported with Terraform version 0.12.0-beta2');
  }
};

const checkProjectDependencies = (workingDir) => {
  let error = false;
  try {
    execSync(`cd "${workingDir}" && terraform show`, { stdio: 'ignore' });
  } catch (ex) {
    error = true;
  }

  if (error) {
    throw new Error(`The directory '${workingDir}' does not have an initialized Terraform project.`);
  }
};

const commandOptions = {
  'terraform.plan': flags.string({
    description: 'Specify an existing Terraform state file instead of generating a new one',
  }),
};

const load = (workingDir, settings) => {
  let plan;

  if (settings && settings['terraform.plan']) {
    const planFilePath = path.resolve(workingDir, settings['terraform.plan']);
    const rawdata = fs.readFileSync(planFilePath);
    plan = JSON.parse(rawdata);
  } else {
    const tmpobj = tmp.fileSync();
    try {
      execSync(`cd "${workingDir}" && terraform plan -out ${tmpobj.name}`, { stdio: 'ignore' });
      plan = JSON.parse(execSync(`cd ${workingDir} && terraform show -json ${tmpobj.name}`).toString());
    } catch (ex) {
      throw new Error('Failed to generate terraform plan using `terraform plan` and `terraform show` command');
    }
  }

  return plan;
};

module.exports = {
  load,
  commandOptions,
  checkDependencies,
  checkProjectDependencies,
};
