module.exports = (data, settings) => {
  const validSettings = !settings
    || !settings.allowed
    || !Array.isArray(settings.allowed)
    || settings.allowed.length === 0;
  if (validSettings) {
    throw new Error("This policy requires the 'allowed' setting to be set");
  }
  const allowedTypes = settings.allowed || [];
  const { resources } = data.planned_values.root_module;
  const awsInstances = resources.filter(x => x.type === 'aws_instance');

  awsInstances.forEach((awsInstance) => {
    const instanceType = awsInstance.values.instance_type;
    if (!allowedTypes.includes(instanceType)) {
      const allowedStrings = allowedTypes.map(type => `"${type}"`).join(', ');
      const errorMessage = `The AWS EC2 Instance "${awsInstance.name}" uses "${instanceType}" instance type which is
        not allowed. Only ${allowedStrings} are allowed.`;
      throw new Error(errorMessage);
    }
  });

  return true;
};
