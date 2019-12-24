const storage = {};

module.exports = {
  get: key => storage[key],
  set: (key, value) => {
    storage[key] = value;
  },
};
