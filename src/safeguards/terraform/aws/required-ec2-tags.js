const jsonata = require('jsonata');
const { results } = require('../../../lib/policy_results');

const provisioner = 'terraform';

const check = (data, settings) => {
  if (!settings || !settings.tags || !Array.isArray(settings.tags) || settings.tags.length === 0) {
    results.fail("This policy requires the 'tags' setting to be set");
  }
  const requiredTags = settings.tags || [];

  const awsInstances = jsonata('[planned_values.**.resources[type="aws_instance"]]').evaluate(data);

  awsInstances.forEach((awsInstance) => {
    const tagKeys = Object.keys(awsInstance.values.tags);
    const allKeysFound = requiredTags.every(requiredTag => tagKeys.includes(requiredTag));
    if (!allKeysFound) {
      results.fail(`${awsInstance.address} is missing one or more of the required tags, ${requiredTags.join(', ')}`);
    }
  });

  return results.pass();
};

module.exports = { provisioner, check };
