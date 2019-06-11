const jsonata = require('jsonata');
const { results } = require('../../lib/policy_results');

const provisioner = 'terraform';

const check = (data, settings) => {
  const allowedSources = settings.allowed;

  const matchExp = '**.module_calls.*.source';
  const moduleSources = jsonata(matchExp).evaluate(data);

  const regex = /^([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)$/;
  moduleSources.forEach((moduleSource) => {
    if (moduleSource.match(regex)) {
      if (!allowedSources.includes(moduleSource)) {
        results.fail(`Module source "${moduleSource}" is not an approved module`);
      }
    }
  });

  return results.pass();
};

module.exports = { provisioner, check };
