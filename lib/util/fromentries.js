'use strict';

// Small utility to mimic Object.fromEntries to avoid big polyfill dependency
// @ts-ignore
const fromEntries = Object.fromEntries || function fromEntries(entries) {
  const obj = {};
  for (const [key, value] of entries) obj[key] = value;
  return obj;
};

module.exports = {
  fromEntries,
};
