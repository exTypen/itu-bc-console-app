const { swap } = require('./firebaseService');
const { PUBLIC_KEY } = require('./userService');
const { POOL_ID } = require('./poolService');

async function swapAction(tokenType, amount) {
  return await swap(PUBLIC_KEY, POOL_ID, tokenType, amount);
}

module.exports = {
  swapAction
};
