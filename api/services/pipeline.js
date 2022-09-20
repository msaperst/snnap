// pipeline.js, for some examples

// client specific messages
// each client gets an individual instance
function individualPipeline(ctx) {
  let idx = 0;
  return setInterval(() => {
    ctx.send(`ping pong ${idx}`);
    idx++;
  }, 5000);
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

module.exports = { broadcastPipeline, individualPipeline };
