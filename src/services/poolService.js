const chalk = require('chalk');
const { getPool } = require('./firebaseService');

const POOL_ID = "defaultPool";

async function showPool() {
  const pool = await getPool(POOL_ID);
  console.log(chalk.green('Havuz Durumu:'));
  console.log(chalk.blue(`TokenA: ${pool.tokenA}`));
  console.log(chalk.blue(`TokenB: ${pool.tokenB}`));
  console.log(chalk.blue(`K: ${pool.K}`));
}

module.exports = {
  showPool,
  POOL_ID
};
