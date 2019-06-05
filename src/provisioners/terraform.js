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

    try {
      execSync(`cd ${workingDir} && terraform plan -out ${tmpobj.name}`);
      plan = JSON.parse(execSync(`cd ${workingDir} && terraform show -json ${tmpobj.name}`).toString());
    } catch (ex) {
      throw new Error('Failed to generate terraform plan using `terraform plan` and `terraform show` command');
    }
  }

  return plan;
};
