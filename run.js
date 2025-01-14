"use strict";
require('dotenv').config();
const DiscordJS = require("discord.js");
const sqlite3 = require("sqlite3");
const DiscordClient = new DiscordJS.Client();
const ChatFunctions = require("./src/ChatFunctions");
const GamesRepository = require("./src/Repositories/GamesRepository");
const ParticipantRepository = require("./src/Repositories/ParticipantRepository");
const Game = require("./src/Game");
const DbAdapter = require("./src/DbAdapter");

const db = new sqlite3.Database('/etc/discord-p-bot/database.db3');

db.run("CREATE TABLE IF NOT EXISTS participants (id INTEGER PRIMARY KEY AUTOINCREMENT, discord_guild_id TEXT, discord_user_id TEXT, discord_user_name TEXT, score INTEGER)");
db.run("CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, discord_guild_id TEXT, winner_participant_id INTEGER, datetime INTEGER)");

const dbAdapter = new DbAdapter(db);
const gamesRepository = new GamesRepository(dbAdapter);
const participantsRepository = new ParticipantRepository(dbAdapter);
const game = new Game(dbAdapter, participantsRepository, gamesRepository);

DiscordClient.on('message', msg => {
    if (msg.content.match(/^!пидордня/) || msg.content.match(/^!пидорня/)) {
        participantsRepository
            .IsParticipantExists(msg.author.id, msg.guild.id)
            .then(isExists => {
                if (isExists) {
                    ChatFunctions.temporaryMessage(msg.channel, "Ты уже в игре, забыл чтоли? :thinking:", 7000);
                } else {
                    participantsRepository.AddParticipant(msg.author.id, msg.guild.id, ChatFunctions.getNickname(msg));
                    ChatFunctions.temporaryMessage(msg.channel, "Приветствуем тебя, " + ChatFunctions.getNickname(msg), 5000)
                }
            });

        ChatFunctions.deleteMessage(msg, 2000);
        return;
    }

    if (msg.content.match(/^!ктопидор/)) {
        game.CanStartGame(msg.guild.id).then(() => {
            game.Run(msg.guild.id).then(async winMsg => {
                await game.Tease(msg.channel).then();
                msg.channel.send(winMsg);
            }, reject => {
                ChatFunctions.temporaryMessage(msg.channel, reject, 8000);
            });
        }, reject => {
            msg.channel.send("А пидор сегодня - " + reject);
        });

        ChatFunctions.deleteMessage(msg, 1000);
    }

    if (msg.content.match(/^!топпидоров/)) {
        game.GetStats(msg.guild.id).then(message => {
            ChatFunctions.temporaryMessage(msg.channel, message, 15000);
        });
        ChatFunctions.deleteMessage(msg, 1000);
        return;
    }

    if (msg.content.match(/^!исключить/)) {
        let chunks = msg.cleanContent.split(' ');
        chunks.splice(0, 1);
        let discordId = chunks.join('');

        if (msg.author.id !== process.env.ADMIN_USERID) {
            ChatFunctions.temporaryMessage(msg.channel, "Вы кто такой? Я вас не звал. Идите нахуй!");
            // ChatFunctions.deleteMessage(msg, 3000);
            return;
        }
        ChatFunctions.temporaryMessage(msg.channel, "Пидарнул пидорка нахуй");
        // ChatFunctions.deleteMessage(msg, 3000);
        participantsRepository.RemoveParticipant(discordId, msg.guild.id)
        return;
    }
    
    if (msg.content.match(/^!добавитьдружка/)) {

        if (msg.author.id !== process.env.ADMIN_USERID) {
            ChatFunctions.temporaryMessage(msg.channel, "У тебя нет здесь власти.");
            // ChatFunctions.deleteMessage(msg, 3000);
            return;
        }
        
        
        if (!msg.mentions.everyone)
        {
            let mentionedUser = msg.mentions.users.first();
            participantsRepository
                .IsParticipantExists(mentionedUser.id, msg.guild.id)
                .then(isExists => {
                    if (isExists) {
                        ChatFunctions.temporaryMessage(msg.channel, "Так " + mentionedUser.username + " уже играет. :grin:", 7000);
                    } else {
                        participantsRepository.AddParticipant(mentionedUser.id, msg.guild.id, ChatFunctions.getNickname(msg));
                        ChatFunctions.temporaryMessage(msg.channel, "Тебя пригласили в игру, " + "<@" + mentionedUser.id + ">", 5000)
                    }
                });
        }
        return;
    }
});

DiscordClient.login(process.env.BOT_TOKEN).then(r => console.log('The bot has started!'));
