/* eslint max-classes-per-file: ["error", 2] */

class FailResultError extends Error {

}

class SkipResultError extends Error {

}

const pass = () => true;
const fail = (message) => {
  throw new FailResultError(message);
};
const skip = (message) => {
  throw new SkipResultError(message);
};

module.exports = {
  FailResultError,
  SkipResultError,
  results: { pass, fail, skip },
};
