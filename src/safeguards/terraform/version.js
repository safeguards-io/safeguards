const semver = require('semver');

const provisioner = 'terraform';

const check = (data, settings) => {
  const { range } = settings;
  const version = data.terraform_version;
  const passes = semver.satisfies(version, range);

  if (!passes) {
    throw new Error(`The Terraform Version, ${version}, does not meet the required version range, ${range}`);
  }

  return true;
};

module.exports = { provisioner, check };
