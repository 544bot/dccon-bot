const Discord = require('discord.js');
const fs = require('fs');
const commands = require('./commands.js')
const { suffix, suffix2, token } = require('./config.json');

//봇 시작
const bot = new Discord.Client();
let botstopcount = 0;
let countbasetime = 0;

bot.on('ready', () => {
    console.log('봇 기동 확인');
    bot.user.setActivity('콘목록')
})

//명령어들

bot.on('message', msg => {
    //봇이 하는 말이나 등록되지 않은 커맨드는 씹는다.
    if (msg.author.bot) return;
    if (msg.content.endsWith(suffix2)){
        let args = msg.content.slice(0, msg.content.length - suffix2.length);
        if (args.length === 0) return;
        if (args.endsWith(' ')) {
            args = args.slice(0, args.length - 1);
        }
        try {
            commands.listup(msg, args);
        }catch (error) {
            console.error(error);
            msg.channel.send('문제가 발생했다아아악 나죽는다아악');
        }
    }
    else if (msg.content.endsWith(suffix)) {
        let args = msg.content.slice(0, msg.content.length - suffix.length);
        if (args.length === 0) return;
        args = args.split(' ');
        commands.send_con(msg, args);
    }
});

bot.on('messageReactionAdd', (reaction, user) => {
    let recentlist = fs.readFileSync("./recentlist.json", (err, data) => {
        if (err) throw err;
        console.log(data);
    });
    recentlist = JSON.parse(recentlist);

    if (!user.bot && reaction.message.id === recentlist.listid) {
        if (reaction.emoji.name === "⬅") {
            if (recentlist.page - 1 > -1) {
                recentlist.page--;
                reaction.message.edit('```' + recentlist.printlist[recentlist.page].join(', ') + '```');
            }
        } else if (reaction.emoji.name === "➡") {
            if (recentlist.page + 1 < recentlist.printlist.length) {
                recentlist.page++;
                reaction.message.edit('```' + recentlist.printlist[recentlist.page].join(', ') + '```');
            }
        }

        recentlist.listid = recentlist.listid;
        recentlist.page = recentlist.page;
        recentlist.printlist = recentlist.printlist;

        fs.writeFile("./recentlist.json", JSON.stringify(recentlist, null, 4), (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    }
});

//로그인
bot.login(token);
