/* eslint-disable import/no-dynamic-require, global-require */
const loadProvisioner = source => require(`../provisioners/${source}`);

const loadData = (workingDir, providerSettings) => ({
  terraform: loadProvisioner('terraform')(workingDir, providerSettings),
});

module.exports = {
  loadData,
};
