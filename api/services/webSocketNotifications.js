async function sendUnreadNotifications(user, ctx) {
  const notifications = await user.getNotifications();
  const unread = notifications.filter((val) => !val.reviewed);
  ctx.send(unread.length);
}

function getUnreadMessageCount(ctx, user) {
  sendUnreadNotifications(user, ctx);
  return setInterval(async () => {
    await sendUnreadNotifications(user, ctx);
  }, 1000);
}

module.exports = { getUnreadMessageCount };
