const Chat = require('../components/chat/Chat');

async function sendConversationList(user, ctx) {
  const chat = new Chat(await user.getId());
  const conversationList = await chat.getConversationList();
  ctx.send(JSON.stringify(conversationList));
}

function getConversationList(ctx, user) {
  sendConversationList(user, ctx);
  return setInterval(async () => {
    await sendConversationList(user, ctx);
  }, 1000);
}

module.exports = { getConversationList };
