const Job = require('../components/job/Job');
const User = require('../components/user/User');

// broadcast messages
// one instance for all clients
// function getJobs(clients) {
//   return setInterval(async () => {
//     const jobs = await Job.getJobs();
//     for (const c of clients.values()) {
//       c.send(JSON.stringify(jobs));
//     }
//   }, 10000);
// }

async function sendJobs(ctx) {
  const jobs = await Job.getJobs();
  ctx.send(JSON.stringify(jobs));
}

function getJobs(ctx, token) {
  User.auth(token);
  sendJobs(ctx);
  return setInterval(async () => {
    await sendJobs(ctx);
  }, 1000);
}

module.exports = { getJobs };
