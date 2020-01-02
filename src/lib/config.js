const yaml = require('js-yaml');
const fs = require('fs');

const loadConfig = async (configFilePath) => {
  let doc;
  try {
    doc = yaml.safeLoad(fs.readFileSync(configFilePath, 'utf8'));
  } catch (ex) {
    throw new Error(`Failed to load config file "${configFilePath}"`);
  }

  if (!doc || !Array.isArray(doc) || doc.length === 0) {
    throw new Error('Config file must define at least one policy');
  }

  doc.forEach((policy) => {
    if (!policy.name || !policy.safeguard) {
      throw new Error('Each policy must define a name and safeguard');
    }
  });

  return doc;
};

module.exports = {
  loadConfig,
};
