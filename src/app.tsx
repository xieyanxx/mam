import { debounce } from "lodash";
import initReactFastclick from "react-fastclick";
// eruda.init();

initReactFastclick();

const resize = debounce(
  () => {
    window.dispatchEvent(new CustomEvent("debounceResize"));
  },
  300,
  { leading: true }
);
window.addEventListener("resize", resize);
resize();
