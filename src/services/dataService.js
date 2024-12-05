const { readJSON, writeJSON } = require('../utils/fileUtils');

async function getPoolData() {
  const data = await readJSON('pool.json');
  return data.pool;
}

async function updatePoolData(pool) {
  await writeJSON('pool.json', { pool });
}

async function getUserBalance() {
  const data = await readJSON('userBalance.json');
  return data.userBalance;
}

async function updateUserBalance(balance) {
  await writeJSON('userBalance.json', { userBalance: balance });
}

module.exports = {
  getPoolData,
  updatePoolData,
  getUserBalance,
  updateUserBalance
};
