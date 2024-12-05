const chalk = require('chalk');
const { getMyWallet } = require('./firebaseService');


const PUBLIC_KEY = '0x23abc...';

async function showUserBalance() {
  const balance = await getMyWallet(PUBLIC_KEY);
  console.log(chalk.yellow('Kullanıcı Bakiyesi:'));
  console.log(chalk.magenta(`TokenA: ${balance.tokenA}`));
  console.log(chalk.magenta(`TokenB: ${balance.tokenB}`));
}

module.exports = {
  showUserBalance,
  PUBLIC_KEY
};
