'use strict';

// Front processing of bot

// Read notificatins from mastodon server.  If it is mention, disassemble and push it into jobWaitQueue.
// Get result from in jobDoneQueue then toot.

// Mastodon
const Mastodon = require('mastodon');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json', "utf8"));
const M = new Mastodon(config);

// Redis
const redis = require("redis");
const redisClient = redis.createClient("./redis-data/redis.sock");
// Remember status for the purpose not to process same state twice
const STATUS_ID_SET = "StatusIdSet";
const JOB_WAIT_QUEUE = "jobWaitQueue";
const JOB_DONE_QUEUE = "jobDoneQueue";

const NOTIFICATION_INTERVAL_MIN = 1000;
const NOTIFICATION_INTERVAL_INC = 100;
const NOTIFICATION_INTERVAL_DEC = 1;
let notificationInterval = NOTIFICATION_INTERVAL_MIN;
const POP_JOB_DONE_QUEUE_INTERVAL = 1500;
const SHUTDOWN_WAIT_REDIS = 3000;
const SHUTDOWN_WAIT = 4000;

const disassembleContent = require("./lib/disassemble-content");

let shutdownFlag = false;

function cleanup(callback) {
  console.log('plese wait until stop.');

  shutdownFlag = true;

  setTimeout(() => {
    redisClient.quit();
  }, SHUTDOWN_WAIT_REDIS);

  if (callback) {
    setTimeout(callback, SHUTDOWN_WAIT);
  }
}

redisClient.on("error", function (err) {
  console.log("Redis client error: " + err);
});

process.on('SIGINT', function () {
  cleanup(()=>{
    console.log("Bye");
    process.exit(0);
  });
});

function replyError(msg, status) {
  if (!status.account || !status.account.acct) {
    return;
  }
  const data = {
    status: '@' + status.account.acct + "\n" + msg,
    in_reply_to_id: status.id,
    visibility: 'direct'
  };
  console.log('post:' + JSON.stringify(data));
  M.post('statuses', data);
}

function rpushData(notification) {
  const status = notification.status;

  const data = disassembleContent(status.content);
  if (!data) {
    replyError('Unknown error!', status);
    return;
  }
  if (data.error) {
    replyError(data.error, status);
    return;
  }
  data.status_id = status.id;
  data.acct = status.account.acct;
  data.visibility = status.visibility;

  const json = JSON.stringify(data);

  redisClient.rpush(JOB_WAIT_QUEUE, json, (err) => {
    if (err) {
      console.log("ERR RPUSH JOB_WAIT_QUEUE:" + err + ':' + JSON.stringify(data));
      return;
    }
  });
}

function onNotifications(notificationArray) {
  notificationArray.reverse().forEach((notification) => {
    if (notification.type === 'mention') {
      if (!notification.status) {
        return;
      }
      const status_id = notification.status.id;
      redisClient.sismember([STATUS_ID_SET, status_id], (err, exist) => {
        if (err) {
          console.log("ERR SISMEMBER:" + err);
          process.exit(0);
        }
        if (!exist) {
          console.log('get: ' + JSON.stringify(notification));
          redisClient.sadd([STATUS_ID_SET, status_id], (err) => {
            if (err) {
              console.log("ERR SADD:" + err);
              process.exit(0);
            }
            rpushData(notification);
          });
        }
      });
    }
  });
}

function getNotifications() {
  if (shutdownFlag) {
    return;
  }
  M.get('notifications', {}).then((resp) => {
    if (resp
        && resp.resp
        && resp.resp.statusCode === 200
        && resp.data) {
      onNotifications(resp.data);
      if (notificationInterval > NOTIFICATION_INTERVAL_MIN) {
        notificationInterval -= NOTIFICATION_INTERVAL_DEC;
      }
    } else {
      console.log('ERROR resp=' + JSON.stringify(resp, null, 4));
      notificationInterval += NOTIFICATION_INTERVAL_INC;
    }
    setTimeout(getNotifications, notificationInterval);
  });
}


function postStatus(json) {
  const d = JSON.parse(json);
  if (!d) {
    return;
  }

  let output = d.output;
  if (output === '') {
    output = d.file_name + ' output';
  }

  let text = `@${d.acct}\n${output}`;
  text = text.trim() + "\n";
  text = text.substr(0, 500);
  text = text.replace(/@hello/,'＠hello');

  const data = {
    status: text,
    in_reply_to_id: d.status_id,
    visibility: d.visibility
  };

  console.log('post: ' + JSON.stringify(data));
  if (d.visibility === 'public') {
    M.post('statuses/' + d.status_id + '/reblog', null, () => {
      if (d.attach) {
        M.post('media', { file: fs.createReadStream(d.attach) }).then(resp => {
          data.media_ids = [resp.data.id];
          M.post('statuses', data);
        });
      } else {
        M.post('statuses', data);
      }
    });
  } else {
    if (d.attach) {
      M.post('media', { file: fs.createReadStream(d.attach) }).then(resp => {
        data.media_ids = [resp.data.id];
        M.post('statuses', data);
        fs.unlink(d.attach);
      });
    } else {
      M.post('statuses', data);
    }
  }
}

function popJobDoneQueue() {
  if (shutdownFlag) {
    return;
  }
  redisClient.blpop(JOB_DONE_QUEUE, 1, function(err, data){
    if (err) {
      console.log("ERR BLPOP JOB_DONE_QUEUE:" + err);
    } else if (data) {
      postStatus(data[1]);
    }
    setTimeout(popJobDoneQueue, POP_JOB_DONE_QUEUE_INTERVAL);
  });
}

getNotifications();
popJobDoneQueue();

console.log("Hello bot front.");
fs.writeFileSync('./job/front.pid', process.pid, 'utf8');

