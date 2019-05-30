import { OverlayElement } from './OverlayElement.js';

export class QueuedOverlayElement extends OverlayElement {

    get attributes() {
        return [
            'displayTime'
        ];
    }

    constructor() {
        super();

        this.displayTime = this.displayTime || 5000;

        this.setState({
            current: this.state.current,
            queue: this.state.queue || []
        });

        setInterval(() => this.nextIfDone(), this.displayTime);
    }

    push(data) {
        this.state.queue.unshift(Object.assign(data, {
            timestamp: Date.now()
        }));
        this.setState(this.state);
        this.nextIfDone();
    }

    nextIfDone() {
        const nextEvent = this.state.queue[0];
        if(nextEvent) {
            const delta = Date.now() - nextEvent.timestamp;
            if(delta > this.displayTime) {
                this.next();
            }
        }
    }

    next() {
        const item = this.state.queue.pop();
        this.state.current = item;
        this.setState(this.state);
    }
}
