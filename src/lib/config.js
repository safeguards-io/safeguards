const yaml = require('js-yaml');
const fs = require('fs');

const loadConfig = (configFilePath) => {
  let doc
  try {
    doc = yaml.safeLoad(fs.readFileSync(configFilePath, 'utf8'));
  } catch(ex) {
    throw new Error(`Failed to load config file "${configFilePath}"`)
  }

  if(!doc.providers && typeof doc.providers != 'object') {
    throw new Error(`Config file must define at least one provider`)
  }

  if(!doc.policies && typeof doc.policies != 'object') {
    throw new Error(`Config file must define at least one policy`)
  }
  
  let policies = doc.policies
  Object.keys(policies).map((policyName, index) => {
    let policy = doc.policies[policyName]
    
    if(!policy.safeguard || !policy.provider) {
      throw new Error(`Each policy must define a safeguard and provider`)
    }

    policy.enforcement = policy.enforcement || 'warning'
    policy.settings = policy.settings || null

    if(!(policy.provider in doc.providers)){
      throw new Error(`Provider "${policy.provider}" in "${policyName}" wasn't found`)
    }
    return policy
  });

  doc.policies = policies

  return doc
}

module.exports = {
  loadConfig
}