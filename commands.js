const Discord = require('discord.js');
const fs = require('fs');

function get_printlist(pass) {
    const MAX_LENGTH = 500;

    try {
        fileLists = fs.readdirSync(pass);
    } catch(error) {
        return 'error';
    }

    let temptoken = null;
    let templist = [];
    let printlength = 6;

    print = [];

    while (fileLists.length !== 0) {
        temptoken = fileLists.shift();
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

    return print;
};

exports.listup = (msg, args) => {

    let pass = './image';

    if (args.indexOf("../") != -1) {
        msg.channel.send('개수작 부리지 마라');
        return;
    }
    if (args != '콘') {
        pass = pass.concat(`/${args}`);
    }
    printlist = get_printlist(pass);
    if (printlist === 'error') {
        msg.channel.send('뭘 잘못 입력하신 것 같은데?');
        return;
    }
    if (args === '콘') {
        msg.channel.send('콘 종류 목록입니다. 종류별로 사용가능한 콘은 <콘종류 목록>을 입력하세요');
    } else if (printlist[0].length === 0) {
        msg.channel.send('비어있는디요?');
        return;
    } else {
        msg.channel.send(`${args}안에 있는 콘 종류 목록입니다. 사용하려면 <${args} <콘이름>콘>을 입력하세요`);
    }
    try {
        msg.channel.send('```' + printlist[0].join(', ') + '```')
            .then(message => {
                if (printlist.length !== 1) {
                    message.react("⬅");
                    message.react("➡");

                    let recentlist = new Object();

                    recentlist.listid = message.id;
                    recentlist.page = 0;
                    recentlist.printlist = printlist;

                    fs.writeFile("./recentlist.json", JSON.stringify(recentlist, null, 4), (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                       });

                    return;
                } else {
                    return;
                }
            }).catch();
    } catch (err) {
        msg.channel.send('몬가... 몬가... 에러가 생겼음...');
        return;
    }

};

exports.send_con = (msg, args) => {
    let conlist = fs.readdirSync('./image');
    if (conlist.indexOf(args[0]) !== -1) {
        if (args.length === 1) {
            msg.channel.send('뭘 잘못 입력하신것 같은데?');
        } else {
            conlist = fs.readdirSync('./image/' + args[0]);
            if (conlist.length === 0) {
                msg.channel.send('그런 콘 읎어여 읎어');
                return;
            }
            if (args[1] === '랜덤') {
                let randn = Math.floor(Math.random() * conlist.length);
                if (randn === conlist.length) randn = conlist.length-1;
                msg.channel.send({
                    files: [{
                        attachment: './image/' + args[0] + '/' + conlist[randn]
                    }]
                });
                msg.channel.send(conlist[randn]);
            } else {
                const tgt = conlist.filter(con => {
                    return con.toString().startsWith(args[1]);
                });
                if (tgt.length > 0) {
                    let randn = Math.floor(Math.random() * tgt.length);
                    if (randn === tgt.length) randn = tgt.length - 1;
                    msg.channel.send({
                        files: [{
                            attachment: './image/' + args[0] + '/' + tgt[randn]
                        }]
                    });
                } else {
                    msg.channel.send('그런 콘 없어요');
                }
            }
        }
    } else {
        msg.channel.send('그런 콘 없어요.');
    }
};

exports.modify_name = (msg, args) => {

};