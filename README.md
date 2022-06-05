# Pidor bot. Docker edition
[![Docker size](https://img.shields.io/docker/image-size/diman8/discord-pidorbot/latest)](https://hub.docker.com/r/nouchka/sqlite3/)

Только для настоящих мужчин.

Github - https://github.com/diman8/discord-pidor-bot

Dockerhub - https://hub.docker.com/r/diman8/discord-pidorbot

## Как играть
1) Добавить себя в список участников можно командой **!пидордня**.
2) Рулетку стартует любой желающий командой **!ктопидор**, не более 1 раза в сутки.
3) По команде **!топпидоров** можно посмотреть топ10 пидоров своего сервера

---
## Docker Compose Script
```
version: '2'
services:
  discord_p_bot:
    image: diman8/discord-pidorbot
    container_name: discord_p_bot
    restart: always
    environment:
     - BOT_TOKEN=%discord-token-key%
     - ADMIN_USERID=%discord-admin-userid%
     # example - ADMIN_USERID=18XXXXXXXXXXXXXX46
    volumes:
     - ./config:/etc/discord-p-bot/

```