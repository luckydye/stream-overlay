import { rain } from './animation.js';

function parseSearchParams(string) {
    const params = {};
    const arr = string.split(/[\#|\?\&]/g);
    for(let item of arr) {
        const pair = item.split("=");
        if(pair[0]) {
            params[pair[0]] = pair[1];
        }
    }
    return params;
}

const token = parseSearchParams(location.search).token;

function log(...str) {
    console.log('[Socket]', ...str);
}

function connect() {
    const ws = new WebSocket(`wss://1uckybot.luckydye.de/?token=${token}`, '1uckybot-protocol');

    ws.onopen = () => {
        log('Connection Open');

        setInterval(() => {
            ws.send(JSON.stringify({ type: 'ping' }));
        }, 1000 * 60 * 5);
    }

    ws.onerror = () => {
        log('Connection Error');
    }

    ws.onclose = () => {
        log('Connection Closed');
        setTimeout(() => connect(), 2000);
    }

    ws.onmessage = msg => {
        const data = JSON.parse(msg.data);
        log(data);

        if(data.action == 'reward.emoterain') {
            rain();
            console.log('EMOTE RAIN');
        }
    }
    
    rain();

    window.rain = () => rain();

    return ws;
}

if(token) {
    connect();
} else {
    document.body.innerHTML = `<h1>Missing access token.</h1>`;
}
