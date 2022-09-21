const User = require('../components/user/User');

async function sendUnreadNotifications(user, ctx) {
  const notifications = await user.getNotifications();
  const unread = notifications.filter((val) => !val.reviewed);
  ctx.send(unread.length);
}

function getUnreadMessageCount(ctx, token) {
  const user = User.auth(token);
  sendUnreadNotifications(user, ctx);
  return setInterval(async () => {
    await sendUnreadNotifications(user, ctx);
  }, 1000);
}

// broadcast messages
// one instance for all clients
function broadcastPipeline(clients) {
  let idx = 0;
  return setInterval(() => {
    for (const c of clients.values()) {
      c.send(`broadcast message ${idx}`);
    }
    idx++;
  }, 3000);
}

module.exports = { broadcastPipeline, getUnreadMessageCount };
