const jsonata = require('jsonata');


const provisioner = 'terraform';

const check = (data, settings) => {
  const allowedSources = settings.allowed;

  const matchExp = '**.module_calls.*.source';
  const moduleSources = jsonata(matchExp).evaluate(data);

  const regex = /^([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)$/;
  moduleSources.forEach((moduleSource) => {
    if (moduleSource.match(regex)) {
      if (!allowedSources.includes(moduleSource)) {
        throw new Error(`Module source "${moduleSource}" is not an approved module`);
      }
    }
  });

  return true;
};

module.exports = { provisioner, check };
