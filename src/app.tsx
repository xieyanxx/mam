import initReactFastclick from 'react-fastclick';
import { debounce } from 'lodash';

initReactFastclick();

const resize = debounce(
    () => {
        window.dispatchEvent(new CustomEvent('debounceResize'));
    },
    300,
    { leading: true },
);
window.addEventListener('resize', resize);
resize();
