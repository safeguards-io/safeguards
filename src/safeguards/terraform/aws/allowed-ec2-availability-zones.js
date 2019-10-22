const jsonata = require('jsonata');
const { results } = require('../../../lib/policy_results');

const provisioner = 'terraform';

const check = (data, settings) => {
  const validSettings = !settings
    || !settings.allowed
    || !Array.isArray(settings.allowed)
    || settings.allowed.length === 0;
  if (validSettings) {
    results.fail("This policy requires the 'allowed' setting to be set");
  }
  const allowedZones = settings.allowed || [];

  const awsInstances = jsonata('[planned_values.**.resources[type="aws_instance"]]').evaluate(data);

  if (!awsInstances || !awsInstances.length) {
    results.skip("Terraform configuration doesn't create any EC2 instances");
  }

  awsInstances.forEach((awsInstance) => {
    const instanceZone = awsInstance.values.availability_zone;
    if (!allowedZones.includes(instanceZone)) {
      const allowedStrings = allowedZones.map((zone) => `"${zone}"`).join(', ');
      const errorMessage = `The AWS EC2 Instance "${awsInstance.address}" is in the "${instanceZone}" availability zone which is not allowed. Only ${allowedStrings} are allowed.`;
      results.fail(errorMessage);
    }
  });

  return results.pass();
};

module.exports = { provisioner, check };
