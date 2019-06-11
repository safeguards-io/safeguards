const semver = require('semver');
const { results } = require('../../lib/policy_results');

const provisioner = 'terraform';

const check = (data, settings) => {
  const version = data.terraform_version;
  const passes = semver.satisfies(version, settings);
  if (!passes) {
    results.fail(`The Terraform Version, ${version}, does not meet the required version range, ${settings}`);
  }

  return results.pass();
};

module.exports = { provisioner, check };
