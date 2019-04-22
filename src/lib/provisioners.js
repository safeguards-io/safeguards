/* eslint-disable import/no-dynamic-require, global-require */
const loadProvisioner = source => require(`../provisioners/${source}`);

const loadData = (workingDir, providerSettings) => {
  const data = {};

  providerSettings.forEach((settings) => {
    const { source } = settings;
    const id = settings.as || settings.source;

    // Creates a copy of settings without `source` or `as`
    const providerSetting = { ...settings };
    delete providerSetting.source;
    delete providerSetting.as;

    const provider = loadProvisioner(source);

    data[id] = provider(workingDir, providerSetting);
  });

  return data;
};

module.exports = {
  loadData,
};
