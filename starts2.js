let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('/etc/discord-p-bot/database.db3');
let guild_id = process.argv[2];

db.run("DELETE FROM participants WHERE discord_guild_id = "+guild_id);
db.run("DELETE FROM games WHERE discord_guild_id = "+guild_id);

console.log('Resetting guild '+guild_id+" success!");