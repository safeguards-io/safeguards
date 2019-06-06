const path = require('path');
const fs = require('fs');
const tmp = require('tmp');
const { execSync } = require('child_process');

module.exports = (workingDir, settings) => {
  let plan;

  if (settings && settings.plan) {
    const planFilePath = path.resolve(workingDir, settings.plan);
    const rawdata = fs.readFileSync(planFilePath);
    plan = JSON.parse(rawdata);
  } else {
    const tmpobj = tmp.fileSync();

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

    try {
      execSync(`cd ${workingDir} && terraform plan -out ${tmpobj.name}`);
      plan = JSON.parse(execSync(`cd ${workingDir} && terraform show -json ${tmpobj.name}`).toString());
    } catch (ex) {
      throw new Error('Failed to generate terraform plan using `terraform plan` and `terraform show` command');
    }
  }

  return plan;
};
