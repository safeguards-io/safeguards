const os = require('os');
const path = require('path');
const { ensureDir, remove, lstat } = require('fs-extra');
const packageJson = require('package-json');
const semver = require('semver');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { t } = require('typy');
const { curry } = require('ramda');

const dirExists = curry(async (dirPath) => {
  try {
    const stats = await lstat(dirPath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
});

async function getSafeguardVersionToDownload(safeguard) {
  let packageName;
  let specifiedVersion;
  if (safeguard.startsWith('@')) {
    const arr = safeguard.split('@');

    if (arr.length === 2) {
      packageName = safeguard;
      specifiedVersion = undefined;
    } else if (arr.length === 3) {
      packageName = `@${arr[1]}`;
      /* eslint-disable prefer-destructuring */
      specifiedVersion = arr[2];
    } else {
      throw Error(`${safeguard} is not a valid npm query`);
    }
  } else {
    const arr = safeguard.split('@');

    if (arr.length === 1) {
      packageName = safeguard;
      specifiedVersion = undefined;
    } else if (arr.length === 2) {
      [packageName, specifiedVersion] = arr;
    } else {
      throw Error(`${safeguard} is not a valid npm query`);
    }
  }

  const packageData = await packageJson(packageName, { allVersions: true });

  const latestVersion = packageData['dist-tags'].latest;
  const publishedVersions = Object.keys(packageData.versions);

  if (!specifiedVersion || specifiedVersion === 'latest') {
    specifiedVersion = latestVersion;
  }

  const versionToInstall = semver.maxSatisfying(publishedVersions, specifiedVersion);

  if (!versionToInstall) {
    throw Error(`safeguard version that satisfies the query ${safeguard} was not found`);
  }

  return {
    name: packageName,
    version: versionToInstall,
    pair: `${packageName}@${versionToInstall}`,
  };
}


async function download(safeguardsToDownload) {
  if (!safeguardsToDownload.length) {
    return {};
  }

  const localRegistryPath = path.join(os.homedir(), '.safeguards', 'registry');
  await ensureDir(localRegistryPath);

  const safeguardsPathsMap = {};

  const promises = safeguardsToDownload.map(async (safeguard) => {
    let safeguardVersionToInstall;
    try {
      safeguardVersionToInstall = await getSafeguardVersionToDownload(safeguard);
    } catch (e) {
      try {
        require.resolve(safeguard);
        safeguardsPathsMap[safeguard] = safeguard;
        return;
      } catch (re) {
        throw Error(
          `Safeguard "${safeguard}" was not found on NPM nor could it be resolved locally.`,
        );
      }
    }

    const npmInstallPath = path.join(localRegistryPath, safeguardVersionToInstall.pair);
    const requirePath = path.join(npmInstallPath, 'node_modules', safeguardVersionToInstall.name);
    const exactVersion = safeguardVersionToInstall.pair;

    const shouldUpdate = false;

    if (!(await dirExists(requirePath))) {
      try {
        await exec(`npm install ${exactVersion} --prefix ${npmInstallPath}`);
      } catch (e) {
        await remove(npmInstallPath);
        throw e;
      }
    } else if (shouldUpdate) {
      await exec('npm update', { cwd: requirePath });
    }

    safeguardsPathsMap[safeguard] = requirePath;
  });

  await Promise.all(promises);

  return safeguardsPathsMap;
}

const load = async (source, loadPath) => {
  const safeguardPath = (await download([source]))[source];
  /* eslint-disable import/no-dynamic-require, global-require */
  const safeguardRequire = require(safeguardPath);
  const Safeguard = t(safeguardRequire, loadPath.split('/').join('.')).safeObject;
  const safeguard = new Safeguard();
  return (safeguard);
};

module.exports = { download, load };
