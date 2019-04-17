const semver = require('semver');

module.exports = (data, settings) => {
  const { range } = settings;
  const version = data.terraform_version;
  let passes;
  try {
    passes = semver.satisfies(version, range);
  } catch (ex) {
    throw new Error(`The version range ("${range}") is incorrectly formatted`);
  }

  if (!passes) {
    throw new Error(`The Terraform Version, ${version}, does not meet the required version range, ${range}`);
  }

  return true;
};
