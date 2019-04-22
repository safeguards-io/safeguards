const yaml = require('js-yaml');
const fs = require('fs');

const validateConfig = (doc) => {
  if (!doc.provisioners) {
    throw new Error('Config file must define a "provisioner"');
  }

  if (!Array.isArray(doc.provisioners) || !(doc.provisioners.length > 0)) {
    throw new Error('Config file must define at least one "provisioner"');
  }

  if (!doc.provisioners.every(provisioner => provisioner.source)) {
    throw new Error('Config file must define a "source" for each provisioner');
  }

  const multipleProvisioners = doc.provisioners.length > 1;

  if (multipleProvisioners) {
    const provisionerIds = [];
    doc.provisioners.forEach((provisioner) => {
      const provisionerId = provisioner.as || provisioner.source;
      if (provisionerIds.includes(provisionerId)) {
        if (provisioner.as) {
          throw new Error(`The "as" value, ${provisioner.as}, in ${provisionerId} must be unique`);
        } else {
          throw new Error(`The provisioner ${provisioner.source} must be unique, set a unique value using "as".`);
        }
      }
      provisionerIds.push(provisionerId);
    });
  }

  if (!doc.policies || typeof doc.policies !== 'object' || !Object.keys(doc.policies).length > 0) {
    throw new Error('Config file must define at least one policy');
  }


  const provisionerKeys = doc.provisioners.map(p => p.as || p.source);
  Object.keys(doc.policies).forEach((policyName) => {
    const policy = doc.policies[policyName];
    if (!policy) {
      throw new Error(`Must define a configuration for ${policyName}`);
    }

    if (!policy.safeguard) {
      throw new Error('Each policy must define a safeguard');
    }

    if (policy.provisioner && !provisionerKeys.includes(policy.provisioner)) {
      throw new Error(`Provisioner "${policy.provisioner}" in "${policyName}" wasn't found`);
    }
  });
};

const loadConfig = (configFilePath) => {
  let doc;
  try {
    doc = yaml.safeLoad(fs.readFileSync(configFilePath, 'utf8'));
  } catch (ex) {
    throw new Error(`Failed to load config file "${configFilePath}"`);
  }

  validateConfig(doc);

  return doc;
};

module.exports = {
  loadConfig,
};
