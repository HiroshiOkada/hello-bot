const redis = require("redis");
const redisClient = redis.createClient("./redis-data/redis.sock");
const JOB_WAIT_QUEUE = "jobWaitQueue";


redisClient.blpop(JOB_WAIT_QUEUE, 15, function(err, data){
  if (err) {
    console.log("ERR BLPOP:" + err);
    return;
  }
  if (data) {
    console.log(data[1]);
    process.exit(0);
  } else {
    process.exit(0);
  }
});

