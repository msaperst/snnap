const WebSocket = require('ws');
const url = require('url');
const { getUnreadMessageCount } = require('./webSocketNotifications');
const User = require('../components/user/User');
const Chat = require('../components/chat/Chat');
const { getJobs } = require('./webSocketJobs');
const { getNeededRatings } = require('./webSocketRate');

const users = new Set();

// returns the path and params of input url
// the url will be of the format '/demo?token=<token_string>
const getParams = (request) => {
  try {
    const parsed = url.parse(request.url);
    const res = { path: parsed.pathname };
    // split our query params
    parsed.query.split('&').forEach((param) => {
      const [k, v] = param.split('=');
      res[k] = v;
    });
    return res;
  } catch (err) {
    return {};
  }
};

// basic function to send messages
function sendMessage(message) {
  users.forEach(async (user) => {
    if (
      message.to === (await user.user.getUsername()) ||
      message.from === (await user.user.getUsername())
    ) {
      user.ctx.send(JSON.stringify(message));
    }
  });
}

// accepts an http server (covered later)
function webSocketSetup(server) {
  // ws instance
  const wss = new WebSocket.Server({ noServer: true });
  let token;
  let path;

  // could set a broadcast message here
  // broadcastPipeline(wss.clients);

  // handle upgrade of the request
  server.on('upgrade', async (request, socket, head) => {
    try {
      // authentication and some other steps will come here
      token = getParams(request).token;
      path = getParams(request).path;
      // we can choose whether to upgrade or not

      if (token) {
        // this should throw an error if there is a problem
        User.auth(token);
        // user information will be available in req object
        // allow upgrade to web socket
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
        // });
      } else {
        throw new Error('No token found');
      }
    } catch (err) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  });

  // what to do after a connection is established
  wss.on('connection', (ctx) => {
    // console.log('user connected');
    const user = User.auth(token);
    const userRef = {
      ctx,
      user,
    };
    users.add(userRef);

    let unreadMessageCount;
    let jobs;
    let neededRatings;
    if (path === '/wsapp/unreadNotifications') {
      unreadMessageCount = getUnreadMessageCount(ctx, token);
    }
    if (path === '/wsapp/jobs') {
      jobs = getJobs(ctx, token);
    }
    if (path === '/wsapp/neededRatings') {
      neededRatings = getNeededRatings(ctx, token);
    }

    // handle message events
    // receive a message and echo it back
    ctx.on('message', (message) => {
      try {
        // Parsing the message
        const data = JSON.parse(message);

        // Checking if the message is a valid one
        if (typeof data.to !== 'string' || typeof data.body !== 'string') {
          // console.error('Invalid message');
          return;
        }

        // Sending the message
        const messageToSend = {
          to: data.to,
          from: data.from,
          body: data.body,
          sentAt: Date.now(),
        };

        sendMessage(messageToSend);
        Chat.addConversation(messageToSend);
      } catch (e) {
        // console.error('Error passing message!', e);
      }
    });

    // handle close event
    ctx.on('close', () => {
      // console.log('user disconnected');
      users.delete(userRef);
      clearInterval(unreadMessageCount);
      clearInterval(jobs);
      clearInterval(neededRatings);
    });

    // sent a message that we're good to proceed
    // ctx.send('connection established.');
  });
}

module.exports = webSocketSetup;
