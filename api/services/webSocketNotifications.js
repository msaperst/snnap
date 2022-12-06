const Chat = require('../components/chat/Chat');

async function sendUnreadNotifications(user, ctx) {
  const notifications = {};
  const alerts = await user.getNotifications();
  const unreadAlerts = alerts.filter((val) => !val.reviewed);
  notifications.alerts = unreadAlerts.length;

  const chat = new Chat(await user.getId());
  const conversationList = await chat.getConversationList();
  notifications.messages = conversationList.reduce(
    (total, conversation) => total + conversation.unread,
    0
  );

  ctx.send(JSON.stringify(notifications));
}

function getUnreadMessageCount(ctx, user) {
  sendUnreadNotifications(user, ctx);
  return setInterval(async () => {
    await sendUnreadNotifications(user, ctx);
  }, 1000);
}

module.exports = { getUnreadMessageCount };
