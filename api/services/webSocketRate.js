const User = require('../components/user/User');

async function sendJobsToRate(user, ctx) {
  const rates = await user.getNeededRates();
  ctx.send(JSON.stringify(rates));
}

function getNeededRatings(ctx, token) {
  const user = User.auth(token);
  sendJobsToRate(user, ctx);
  return setInterval(async () => {
    await sendJobsToRate(user, ctx);
  }, 6 * 60 * 60 * 1000); // every six hours
}

module.exports = { getNeededRatings };
