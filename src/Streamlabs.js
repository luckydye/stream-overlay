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

export class Streamlabs {

    static get connected() {
        return this.socket ? this.socket.connected : false;
    }

    static on(event, callback) {
        const listeners = this.listeners;
        listeners[event] = listeners[event] ? listeners[event] : [];
        listeners[event].push(callback);
    }

    static emit(event, msg) {
        const listeners = this.listeners;
        if(listeners[event]) {
            for(let callback of listeners[event]) callback(msg);
        }
    }

    static disconnect() {
        this.socket.disconnect();
    }

    static async connect() {
        return new Promise(async (resolve, reject) => {
            if(!this.socket) {
                const access_token = parseSearchParams(location.search).streamlabs;
                const service = `https://sockets.streamlabs.com?token=${access_token}`;

                this.socket = io(service, { transports: ['websocket'] });
    
                this.socket.on('event', (event) => {
                    const events = ['raid', 'follow', 'donation', 'host'];

                    if(events.includes(event.type)) {
                        for(let message of event.message) {
                            this.emit(event.type, message);
                        }
                    }
                });

                this.socket.on('connect', () => {
                    resolve(this.connected);
                });

            } else {
                reject();
            }
        }).catch(err => {
            if(err) console.error(err);
        })
    }

}

Streamlabs.socket = null;
Streamlabs.listeners = {};
