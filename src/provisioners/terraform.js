const path = require('path');
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

  if (tfVersion !== 'v0.12.18') {
    throw new Error('Safgeguards currently is only supported with Terraform version 0.12.18');
  }
};

const commandOptions = {
  'terraform.plan': flags.string({
    description: 'Path to an existing Terraform plan file',
    required: true,
  }),
};

const load = (settings) => {
  const planFilePath = path.resolve(settings['terraform.plan']);
  const rawdata = fs.readFileSync(planFilePath);
  const plan = JSON.parse(rawdata);

  return plan;
};

module.exports = {
  load,
  commandOptions,
  checkDependencies,
};
