const WebSocket = require('ws');
const url = require('url');
const { getUnreadMessageCount } = require('./webSocketNotifications');
const User = require('../components/user/User');

// available as part of nodejs

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

// accepts an http server (covered later)
function webSocketSetup(server) {
  // ws instance
  const wss = new WebSocket.Server({ noServer: true });
  let token;
  let path;
  // could set a broadcast message here

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
    // print number of active connections

    let interval;
    if (path === '/wsapp/unreadNotifications') {
      interval = getUnreadMessageCount(ctx, token);
    }

    // handle message events
    // receive a message and echo it back
    ctx.on('message', (message) => {
      ctx.send(`you said ${message}`);
    });

    // handle close event
    ctx.on('close', () => {
      clearInterval(interval);
    });

    // sent a message that we're good to proceed
    ctx.send('connection established.');
  });
}

module.exports = webSocketSetup;
