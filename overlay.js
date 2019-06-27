import { Config } from './src/Config.js';
import { Loader } from './src/Loader.js';

if(localStorage.getItem('dev') == "true") {
    const streamlabs = localStorage.getItem('streamlabs');

    document.body.setAttribute('dev', '');
    Config.set('streamlabs', streamlabs);
    console.log('using streamlabs key:', streamlabs);
}

Loader.loadComponents([
    Config.load().then(() => {
        Config.set('layout', Config.get('layout'));
        const layout = Config.get('layout');
        console.log("using layout:", layout);
        return Loader.loadStyles('./layouts/' + layout);
    }),
])
