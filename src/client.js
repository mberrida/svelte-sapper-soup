import * as sapper from '@sapper/app';

sapper
  .start({
    target: document.querySelector('#sapper'),
    hydrate: true,
    onError: (e) => {
      console.log('client onError:', e);
    },
  })
  .then(() => {
    console.log('client-side app has started');
  })
  .catch((err) => console.log('client-side error:', err));
