import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function scrollToTop() {
  window.scrollTo(0, 0);
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
}

export default ScrollToTop;
