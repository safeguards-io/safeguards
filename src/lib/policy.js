const color = require('chalk');

const pass = color.green("PASS")
const fail = color.red("FAIL")

const loadPolicyPlan = (policyConfig, data) => {
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
      data: data[policySource.provider],
      safeguard: {
        id: policySource.safeguard,
        function: policyFunction
      }
    }

    return policy
  })
}

const checkPolicies = (policies) => {
  let results = []
  for(const policy of policies) {
    let result = {policy}
    try{
      result.pass = policy.safeguard.function(policy.data, policy.settings) === true
    } catch (ex) {
      result.pass = false
      result.message = ex.message
    }
    results << result
    
    console.log(`[${result.pass ? pass : fail}] ${policy.id}`)
  }
  return results
}

module.exports = {
  loadPolicyPlan,
  checkPolicies
}