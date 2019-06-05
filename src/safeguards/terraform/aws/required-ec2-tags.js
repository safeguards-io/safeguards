const jsonata = require('jsonata');

const provisioner = 'terraform';

const check = (data, settings) => {
  if (!settings || !settings.tags || !Array.isArray(settings.tags) || settings.tags.length === 0) {
    throw new Error("This policy requires the 'tags' setting to be set");
  }
  const requiredTags = settings.tags || [];

  const awsInstances = jsonata('[planned_values.**.resources[type="aws_instance"]]').evaluate(data);

  awsInstances.forEach((awsInstance) => {
    const tagKeys = Object.keys(awsInstance.values.tags);
    const allKeysFound = requiredTags.every(requiredTag => tagKeys.includes(requiredTag));
    if (!allKeysFound) {
      throw new Error(`${awsInstance.address} is missing one or more of the required tags, ${requiredTags.join(', ')}`);
    }
  });

  return true;
};

module.exports = { provisioner, check };
