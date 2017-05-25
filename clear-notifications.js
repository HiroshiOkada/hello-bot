'use strict';

// Mastodon
const Mastodon = require('mastodon');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json', "utf8"));
const M = new Mastodon(config);

M.post('notifications/clear', {}).then(resp => {
  if (resp.resp.statusCode === 200) {
    console.log("OK");
  }
});

