const jsonata = require('jsonata');

module.exports = (data, settings) => {
  const validSettings = !settings
    || !settings.allowed
    || !Array.isArray(settings.allowed)
    || settings.allowed.length === 0;
  if (validSettings) {
    throw new Error("This policy requires the 'allowed' setting to be set");
  }
  const allowedZones = settings.allowed || [];

  const awsInstances = jsonata('[planned_values.**.resources[type="aws_instance"]]').evaluate(data);

  awsInstances.forEach((awsInstance) => {
    const instanceZone = awsInstance.values.availability_zone;
    if (!allowedZones.includes(instanceZone)) {
      const allowedStrings = allowedZones.map(zone => `"${zone}"`).join(', ');
      const errorMessage = `The AWS EC2 Instance "${awsInstance.address}" is in the "${instanceZone}" availability zone which is not allowed. Only ${allowedStrings} are allowed.`;
      throw new Error(errorMessage);
    }
  });

  return true;
};
