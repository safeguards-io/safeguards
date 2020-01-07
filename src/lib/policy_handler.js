const color = require('chalk');
const { SkipResultError } = require('@safeguards/sdk');
const { load } = require('./safeguard_loader');

const stateColor = {
  passed: color.green,
  failed: color.red,
  warned: color.yellow,
  skipped: color.blueBright,
};

/* eslint no-console: ["error", { allow: ["log"] }] */
const policyDetails = (result, i) => {
  console.log(`\n${i + 1}) ${result.policy.name}`);
  if (result.message) {
    console.log(`${result.message ? `   ${stateColor[result.state](result.message)}` : ''}`);
  }
  console.log(`   ${color.grey(`source: ${result.policy.source}`)}`);
  console.log(`   ${color.grey(`safeguard: ${result.policy.safeguard}`)}`);
};


/* eslint no-console: ["error", { allow: ["log"] }] */
const checkPolicies = async (config, data) => {
  const results = [];

  console.log(`${color.bold('RESULTS')}---------------------\n`);

  const promises = config.map(async (policySource) => {
    const policyModule = await load(policySource.source, policySource.safeguard);

    const result = { policy: policySource };
    try {
      const policyResult = policyModule.check(data.terraform, policySource.settings);
      if (policyResult) {
        result.state = 'passed';
      } else {
        result.state = 'fail';
        result.message = 'Safeguard did not respond with pass status. Contact safeguard developer.';
      }
    } catch (ex) {
      if (ex instanceof SkipResultError) {
        result.state = 'skipped';
      } else {
        result.state = policySource.enforcement === 'error' ? 'failed' : 'warned';
      }
      result.message = ex.message;
    }
    results.push(result);

    if (result.state === 'skipped') {
      console.log(`  ${stateColor[result.state](`${result.state}`)}: ${policySource.name}`);
      console.log(`           ${color.grey(result.message)}`);
    } else {
      console.log(`  ${stateColor[result.state](`${result.state}`)}:  ${policySource.name}`);
    }
  });

  await Promise.all(promises);

  const failedResults = results.filter((x) => x.state === 'failed');
  const warnedResults = results.filter((x) => x.state === 'warned');
  const skippedResults = results.filter((x) => x.state === 'skipped');

  const totalCount = results.length;
  const failedCount = failedResults.length;
  const warnedCount = warnedResults.length;
  const skippedCount = skippedResults.length;
  const passedCount = totalCount - failedCount - warnedCount - skippedCount;

  if (warnedCount > 0) {
    console.log(`\n${color.bold('WARNINGS')}--------------------`);
    warnedResults.forEach((result, i) => policyDetails(result, i));
  }

  if (failedCount > 0) {
    console.log(`\n${color.bold('ERRORS')}----------------------`);
    failedResults.forEach((result, i) => policyDetails(result, i));
  }

  console.log(`\n${color.bold('SUMMARY')}: ${totalCount} policies checked: ${color.blueBright(`${skippedCount} skipped`)}, ${color.red(`${failedCount} failures`)}, ${color.yellow(`${warnedCount} warnings`)}, ${color.green(`${passedCount} passed`)}`);

  return results;
};

module.exports = {
  checkPolicies,
};
