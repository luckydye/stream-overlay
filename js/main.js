import { ActorManager } from './ActorManager.js';
import { InfoBar } from './actors/Infobar.js';
import { Alerts } from './actors/Alerts.js';
import { Sounds } from './libs/Sounds.js';

window.addEventListener("DOMContentLoaded", () => load());

const ACCESS_TOKEN = location.search.substr(1);

function load() {
	Sounds.preload('follow', './sounds/follow1.ogg');
	initWebsocketApi(ACCESS_TOKEN);
}

function test() {
	const alertsActor = ActorManager.lookup("alerts");
	alertsActor.push({
		name: "test person",
		message: "test message",
		type: "follow"
	});
}

function initWebsocketApi(token) {

	ActorManager.hookup("infobar", new InfoBar());
	ActorManager.hookup("alerts", new Alerts());

	const infoBarActor = ActorManager.lookup("infobar");
	const alertsActor = ActorManager.lookup("alerts");

	const url = `https://sockets.streamlabs.com?token=${token}`;
	io(url, { transports: ['websocket'] }).on('event', (eventData) => {
		if (eventData.type === 'donation') {
			for(let msg of eventData.message) {
				alertsActor.push({
					name: msg.name,
					message: msg.message,
					type: "donation"
				});
			}
		}
		if (eventData.type === 'follow') {
			infoBarActor.updateItems({ lastfollower: eventData.message[0].name });
			for(let msg of eventData.message) {
				alertsActor.push({
					name: msg.name,
					type: "follow"
				});
			}
		}
		if (eventData.type === 'subscription') {
			for(let msg of eventData.message) {
				alertsActor.push({
					name: msg.name,
					message: msg.message,
					type: "subscription"
				});
			}
		}
	});

	setTimeout(() => {
		alertsActor.trigger();
	}, 500);
}
