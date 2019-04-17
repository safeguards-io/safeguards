const yaml = require('js-yaml');
const fs = require('fs');

const validateConfig = (doc) => {
  if (!doc.providers) {
    throw new Error('Config file must define a "provider"');
  }

  if (!Array.isArray(doc.providers) || !(doc.providers.length > 0)) {
    throw new Error('Config file must define at least one "provider"');
  }

  if (!doc.providers.every(provider => provider.source)) {
    throw new Error('Config file must define a "source" for each provider');
  }

  const multipleProviders = doc.providers.length > 1;

  if (multipleProviders) {
    const providerIds = [];
    doc.providers.forEach((provider) => {
      const providerId = provider.as || provider.source;
      if (providerIds.includes(providerId)) {
        if (provider.as) {
          throw new Error(`The "as" value, ${provider.as}, in ${providerId} must be unique`);
        } else {
          throw new Error(`The provider ${provider.source} must be unique, set a unique value using "as".`);
        }
      }
      providerIds.push(providerId);
    });
  }

  if (!doc.policies || typeof doc.policies !== 'object' || !Object.keys(doc.policies).length > 0) {
    throw new Error('Config file must define at least one policy');
  }


  const providerKeys = doc.providers.map(p => p.as || p.source);
  Object.keys(doc.policies).forEach((policyName) => {
    const policy = doc.policies[policyName];
    if (!policy) {
      throw new Error(`Must define a configuration for ${policyName}`);
    }

    if (!policy.safeguard) {
      throw new Error('Each policy must define a safeguard');
    }

    if (policy.provider && !providerKeys.includes(policy.provider)) {
      throw new Error(`Provider "${policy.provider}" in "${policyName}" wasn't found`);
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
