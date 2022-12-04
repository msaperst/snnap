const Job = require('../components/job/Job');

async function sendJobs(ctx) {
  const jobs = await Job.getJobs();
  ctx.send(JSON.stringify(jobs));
}

function getJobs(ctx) {
  sendJobs(ctx);
  return setInterval(async () => {
    await sendJobs(ctx);
  }, 1000);
}

module.exports = { getJobs };
