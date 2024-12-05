const { addLiquidity } = require('./firebaseService');
const { PUBLIC_KEY } = require('./userService');
const { POOL_ID } = require('./poolService');

async function addLiquidityAction(amountA, amountB) {
  return await addLiquidity(PUBLIC_KEY, POOL_ID, amountA, amountB);
}

module.exports = {
  addLiquidityAction
};
