const soundStore = new Map();

export class Sounds {

	static preload(id, url) {
		const audio = new Audio();
		audio.volume = 0.125;
		audio.src = url;
		soundStore.set(id, audio);
	}

	static play(id) {
		const sound = soundStore.get(id);
		if(sound) {
			sound.play();
		}
	}

}