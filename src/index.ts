import './style/index.styl';
import Root from '@views/Root';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registration: ', registration.scope);
        }).catch((err) => {
          console.log('ServiceWorker registration failed: ', err);
        });
  });
}

new Root(document.body);
