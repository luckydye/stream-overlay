const access_token = location.search.substr(1);

// mine "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IjgwODRFREY3Nzg3QjZGNDQ5RUE5IiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiNDc3MzY4NTUifQ.nBEXqbHCSRa1mijAC0uxxKoza2MR-3rzCnabZAcbOVE"

export class Streamlabs {
    static socket = null;
    static listeners = {};

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
        return new Promise((resolve, reject) => {
            if(!this.socket) {
                const service = `https://sockets.streamlabs.com?token=${access_token}`;

                this.socket = io(service, { transports: ['websocket'] });
    
                this.socket.on('event', (event) => {
                    for(let message of event.message) {
                        this.emit(event.type, message);
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
