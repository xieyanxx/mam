import { useState, useEffect } from "react";
function useMobileToggle() {
  const [isMobile, setIsMobile] = useState(document.body.clientWidth < 800);
  useEffect(() => {
    function resize() {
      setIsMobile(document.body.clientWidth < 800);
    }
    window.addEventListener("debounceResize", resize);
    return () => {
      window.removeEventListener("debounceResize", resize);
    };
  }, []);
  return isMobile;
}

export { useMobileToggle };
