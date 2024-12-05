#!/usr/bin/env node
const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { showUserBalance } = require('./services/userService');
const { showPool, POOL_ID } = require('./services/poolService');
const { addLiquidityAction } = require('./services/liquidityService');
const { swapAction } = require('./services/swapService');

async function mainMenu() {
  console.log(chalk.green('Wallet Connected: 0x23...'));
  console.log('----------------------------------');
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Seçiminizi yapın:',
      choices: [
        { name: 'Show My Balances', value: 'balances' },
        { name: 'ItuSwap (Pools)', value: 'pools' },
        { name: 'ItuScan', value: 'ituscan' },
        { name: 'Disconnect', value: 'exit' }
      ]
    }
  ]);

  if (answers.action === 'balances') {
    await showUserBalance();
    return mainMenu();
  } else if (answers.action === 'pools') {
    return poolMenu();
  } else if (answers.action === 'ituscan') {
    console.log(chalk.cyan('ItuScan fonksiyonu burada uygulanabilir.'));
    return mainMenu();
  } else if (answers.action === 'exit') {
    console.log(chalk.red('Bağlantı kesildi.'));
    process.exit(0);
  }
}

async function poolMenu() {
  console.log(chalk.green('Mevcut Pool: TokenA/TokenB'));
  await showPool();
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'poolAction',
      message: 'Havuz seçeneği:',
      choices: [
        { name: 'Swap', value: 'swap' },
        { name: 'Add Liquidity', value: 'addLiquidity' },
        { name: 'Geri Dön', value: 'back' }
      ]
    }
  ]);

  if (answers.poolAction === 'swap') {
    return swapMenu();
  } else if (answers.poolAction === 'addLiquidity') {
    return addLiquidityMenu();
  } else if (answers.poolAction === 'back') {
    return mainMenu();
  }
}

async function addLiquidityMenu() {
  const answers = await inquirer.prompt([
    {
      type: 'number',
      name: 'amountA',
      message: 'Ne kadar TokenA eklemek istersiniz?',
      default: 10
    },
    {
      type: 'number',
      name: 'amountB',
      message: 'Ne kadar TokenB eklemek istersiniz?',
      default: 10
    }
  ]);

  try {
    await addLiquidityAction(answers.amountA, answers.amountB);
    console.log(chalk.green(`Likidite eklendi: A:${answers.amountA}, B:${answers.amountB}`));
  } catch (err) {
    console.error(chalk.red(err.message));
  }

  return poolMenu();
}

async function swapMenu() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'direction',
      message: 'Hangi tokenı vereceksiniz?',
      choices: [
        { name: 'TokenA ver, TokenB al', value: 'A' },
        { name: 'TokenB ver, TokenA al', value: 'B' }
      ]
    },
    {
      type: 'number',
      name: 'amount',
      message: 'Ne kadar token vereceksiniz?',
      default: 10
    }
  ]);

  try {
    const result = await swapAction(answers.direction, answers.amount);
    console.log(chalk.green(`Swap başarıyla gerçekleşti. Alınan miktar: ${result.swappedOut}`));
  } catch (err) {
    console.error(chalk.red(err.message));
  }

  return poolMenu();
}

const program = new Command();

program
  .command('start')
  .description('DEX Uygulamasını Başlat')
  .action(async () => {
    await mainMenu();
  });

program
  .command('show-balance')
  .description('Kullanıcı bakiyesini gösterir')
  .action(async () => {
    await showUserBalance();
  });

program
  .command('show-pool')
  .description('Havuz durumunu gösterir')
  .action(async () => {
    await showPool();
  });

program.parse(process.argv);

if (process.argv.length < 3) {
  mainMenu();
}
