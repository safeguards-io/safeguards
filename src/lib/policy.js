let loadPolicies = (policyConfig) => {
  return Array.from(Object.keys(policyConfig), x =>{
    let policySource = policyConfig[x]
    let policyFunction
    
    try {
      policyFunction = require(`../policies/${policySource.safeguard}`)
    } catch(ex) {
      throw new Error(`Could not find safeguard ${policySource.safeguard}`)
    }

    let policy = {
      id: x,
      settings: policySource.settings,
      enforcement: policySource.enforcement,
      provider: {
        id: policySource.provider,
      },
      safeguard: {
        id: policySource.safeguard,
        function: policyFunction
      }
    }

    return policy
  })
}

let checkPolicies = (policies) => {
  let results = {}
  for(const policy of policies) {
    console.log(`Checking policy ${policy.id}`)
  }
  return results
}

module.exports = {
  loadPolicies,
  checkPolicies
}