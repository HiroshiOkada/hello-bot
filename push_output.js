const redis = require("redis");
const redisClient = redis.createClient("./redis-data/redis.sock");
const JOB_DONE_QUEUE = "jobDoneQueue";

const data = require('fs').readFileSync('/dev/stdin', 'utf8');

redisClient.rpush(JOB_DONE_QUEUE, data, (err) => {
  if (err) {
    console.log("ERR RPUSH JOB_DONE_QUEUE:" + err + ':' + data);
  } else {
    console.log(data);
  }
  process.exit(0);
});

