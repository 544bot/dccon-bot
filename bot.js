const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require('./config.json');
const MAX_LENGTH = 500;
//봇 시작
const bot = new Discord.Client();
bot.on('ready', () => {
    console.log('봇 기동 확인');
    bot.user.setActivity('!!목록')
})

let recentlist = 0;
let listpage = -1;
let print = [];
//명령어들
bot.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(' ');
    if (args[0] === '목록') {
        let conlist = fs.readdirSync('./image');
        let temptoken = null;
        let templist = [];
        let printlength = 6;
        if (args.length === 1) {
            msg.channel.send('콘 종류 목록입니다. 종류별로 사용가능한 콘은 !!목록 <콘종류>를 입력하세요');
            print = [];
            while (conlist.length !== 0) {
                temptoken = conlist.shift();
                if (printlength + temptoken.toString().length < MAX_LENGTH) {
                    printlength += temptoken.toString().length + 2;
                    templist.push(temptoken);
                } else {
                    print.push(templist);
                    templist = [];
                    printlength = 6;
                    printlength += temptoken.toString().length + 2;
                    templist.push(temptoken);
                }
            }
            print.push(templist);
            msg.channel.send('```' + print[0].join(', ') + '```')
                .then(message => {
                    if (print.length !== 1) {
                        message.react("⬅");
                        message.react("➡");
                        listpage = 0;
                    } else {
                        listpage = -1;
                    }
                    recentlist = message.id;
                }).catch();
        } else {
            if (args[1].indexOf('..') !== -1) {
                msg.channel.send('개수작 부리지 마라');
            } else {
                try {
                    conlist = fs.readdirSync('./image/' + args[1]);
                    print = [];
                    while (conlist.length !== 0) {
                        temptoken = conlist.shift();
                        if (printlength + temptoken.toString().length < MAX_LENGTH) {
                            printlength += temptoken.toString().length + 2;
                            templist.push(temptoken);
                        } else {
                            print.push(templist);
                            templist = [];
                            printlength = 6;
                            printlength += temptoken.toString().length + 2;
                            templist.push(temptoken);
                        }
                    }
                    print.push(templist);
                    msg.channel.send('```' + print[0].join(', ') + '```')
                        .then(message => {
                            if (print.length !== 1) {
                                message.react("⬅");
                                message.react("➡");
                                listpage = 0;
                            } else {
                                listpage = -1;
                            }
                            recentlist = message.id;
                        }).catch();
                } catch (err) {
                    msg.channel.send('그런 폴더 없는 데스웅');
                }
            }
        }
    } else {
        let conlist = fs.readdirSync('./image');
        if (conlist.indexOf(args[0]) !== -1) {
            if (args.length === 1) {
                msg.channel.send('뭘 보내라는 것이지');
            } else {
                conlist = fs.readdirSync('./image/' + args[0]);
                let tgt = conlist.filter(con => {
                    return con.toString().startsWith(args[1]);
                });
                if (tgt.length > 0) {
                    for (let idx = 0; idx < tgt.length; idx++) {
                        msg.channel.send({
                            files: [{
                                attachment: './image/' + args[0] + '/' + tgt[idx]
                            }]
                        });
                    }
                } else {
                    msg.channel.send('그런 콘 없어요');
                }
            }
        } else {
            msg.channel.send('그런 콘 없어요.');
        }
    }
});

bot.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.id === recentlist && !user.bot) {
        if (reaction.emoji.name === "⬅") {
            if (listpage - 1 > -1) {
                listpage--;
                reaction.message.edit('```' + print[listpage].join(', ') + '```');
            }
        } else if (reaction.emoji.name === "➡") {
            if (listpage + 1 < print.length) {
                listpage++;
                reaction.message.edit('```' + print[listpage].join(', ') + '```');
            }
        }
    }
});
//로그인
bot.login(token);
