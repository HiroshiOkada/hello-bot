# Hello bot

A Mastodn bot that run short programs

## Demo

You can use this bot via @hello@mastodon@toycode.com


## Requirement

The version number are not need to strict much.

Linux (Ubuntu 16.04.2 LTS)
Docker (Docker version 17.03.1-ce)
node.js (v6.10.3)
jq (1.5-1)
tmux (2.1)
yarn (0.24.4)

## Installation
```
git clone git@github.com:HiroshiOkada/hello-bot.git
cd hello-bot
cp config.json.sample sample.json`
editor sample.json
yarn install
docker pull okadahiroshi/bot-playground
```
if you don't know how to get `access_token` you can use
[@toycode/mastodon-auth-cli](https://www.npmjs.com/package/@toycode/mastodon-auth-cli).

## Usage

1. start redis server -- yarn start-redis
2. clear notifications (optional) -- yarn clear-notifications
3. start bot -- yran start-bot
4. stop bot -- yarn stop-bot
5. stop redis searver -- yarn stop-redis

## License

MIT
