import soupsLib from '../constants/soups-lib';
import sidesLib from '../constants/sides-lib';
import drinksLib from '../constants/drinks-lib';
import addonsLib from '../constants/addons-lib';
import countriesLib from '../constants/countries-lib';
import { expoIn, expoInOut } from 'svelte/easing';

import emojis from '../constants/emojis';

export const tryCallback = (cb, args = null) => {
  if (typeof cb === 'function') cb(args);
};

export const httpResMSg = (res, theAction = null) => {
  const status = typeof res === 'number' ? res : res.status ? res.status : null;

  if (!res || !theAction || !status) {
    console.log("httpResMSg a besoin d'une réponse http et d'un titre de tâche.");
    return res.statusText;
  }
  const capitalAction = theAction[0].toUpperCase() + theAction.substring(1);

  switch (status) {
    case status < 200:
      return 'Le serveur a reçu la demande et traite ' + theAction;
    case status < 300:
      return capitalAction + ' réussie.';
    case status < 400:
      return (
        "Demande reçue, mais vous devez prendre d'autres mesures pour terminer " +
        theAction
      );
    case status < 500:
      return capitalAction + ' échouée. Vous avez envoyé des données incorrectes.';
    default:
      return capitalAction + " échouée. Une erreur s'est produite sur le serveur.";
  }
};

export const isEmpty = (obj) => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
};

export const hasEmptyFields = (obj, exceptionKeys = [], keyName = null) => {
  // arr
  if (Array.isArray(obj)) {
    return !![...obj].some((item) => hasEmptyFields(item, exceptionKeys));
  }
  // obj
  else if (obj !== null && typeof obj === 'object') {
    return !!Object.entries(obj).some(([key, val]) =>
      hasEmptyFields(val, exceptionKeys, key)
    );
  }

  // bottom level
  const isException = Array.isArray(exceptionKeys)
    ? exceptionKeys.find((f) => f === keyName)
    : keyName === exceptionKeys;
  if (isException) return false;
  // if not whitelisted
  return (
    !obj ||
    obj === null ||
    typeof obj === 'undefined' ||
    obj === '' ||
    obj.length < 1
  );
};

export const allEmptyFields = (obj, exceptionKeys = [], exceptionVals) => {
  if (Array.isArray(obj) || typeof obj !== 'object' || obj === null) {
    console.log('func allEmptyFields takes a regular obj as input.');
    return false;
  }

  const isException = (key) =>
    Array.isArray(exceptionKeys)
      ? !exceptionKeys.find((e) => e === key)
      : key === exceptionKeys;

  let res = true;

  for (let prop in obj) {
    if (obj[prop] && obj[prop] !== '' && !isException(prop)) {
      res = false;
    }
  }

  return res;
};

export const clone = (obj) => {
  // arr
  if (Array.isArray(obj)) {
    return [...obj].map((item, nth) => clone(item, nth));
  }
  // obj
  else if (obj !== null && typeof obj === 'object') {
    let copy = obj.constructor();
    for (var key in obj) {
      copy[key] = clone(obj[key]);
    }
    return copy;
  }
  // bottom level
  return obj;
};

export const orderStatusMsg = (stage = null, pre) => {
  let status = '';
  let due = '';
  let img = 'img/icon/yoga.svg';

  if (stage < 3) due = 'Livraison prévue';

  if (stage === 0) status = 'Votre commande est reçue';
  else if (stage === 1) {
    status = 'Votre commande est en cours de préparation';
    img = 'img/icon/cooking.svg';
  } else if (stage === 2) {
    status = 'Votre nourriture est en chemin!';
    img = 'img/icon/carrier-east.svg';
  } else if (stage === 3) {
    status = 'La nourriture est livrée!';
    due = 'Date de livraison';
    img = 'img/icon/waiter.svg';
  } else return pre;

  return { status, due, img };
};

export const timeStamp = (tags = [], input = 0) => {
  const d = new Date(Date.now() + input);

  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString();

  const obj = {
    year: d.getFullYear(),
    month: d.getMonth(),
    date: d.getDate(),
    weekday: d.getDay() === 0 ? 6 : d.getDay() === 1 ? 0 : d.getDay(),
    min: d.getMinutes(),
    sec: d.getSeconds(),
  };

  if (!Array.isArray(tags)) tags = [tags];

  let res = {
    date,
    time,
    obj,
    tags,
  };

  return res;
};

export const delayTransitionIn = ({
  index = 0,
  count = 1,
  interval = 250,
  duration,
  y = 50,
  x = 0,
  delayAll = 0,
  easing = expoInOut,
  reversed = false,
}) => ({
  x,
  y,
  duration: duration || interval,
  delay: reversed
    ? interval * (count - 1 - index) + delayAll
    : interval * index + delayAll,
  easing,
});
export const delayTransitionOut = ({
  index = 0,
  count = 1,
  interval = 250,
  duration,
  y = 50,
  x = 0,
  delayAll = 0,
  easing = expoInOut,
  reversed = false,
}) => ({
  x,
  y,
  duration: duration || interval,
  delay: reversed
    ? interval * index + delayAll
    : interval * (count - 1 - index) + delayAll,
  easing,
});

const haveStorage = () => {
  if (typeof window === 'undefined') {
    console.log('window and local storage not available');
    return false;
  }

  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');

    console.log('local storage not available');
    return true;
  } catch (e) {
    return false;
  }
};
export const storage = {
  set: (key, val) =>
    haveStorage() ? localStorage.setItem(key, JSON.stringify(val)) : false,
  get: (key) => (haveStorage() ? JSON.parse(localStorage.getItem(key)) : false),
  remove: (key) => (haveStorage() ? localStorage.removeItem(key) : false),
};

export const addressSearch = async (engine, street, city = 'Vannes') => {
  if (typeof engine.search !== 'function') {
    console.log('streetMap engine not provided');
    return false;
  }

  if (!street) {
    console.log('no street address provided');
    return false;
  }

  const coords = await engine.search({ query: `${street}, ${city}` });

  if (coords.length < 1) {
    console.log('failed to get address');
    return false;
  }

  const label = coords[0].label.split(',');
  const cityOutput = label[3].substring(1) + ', Vannes';
  const zip = label[label.length - 2].substring(1);

  // console.log(
  //   'street',
  //   street,
  //   'zip',
  //   zip,
  //   'city',
  //   cityOutput,
  //   'coords',
  //   coords[0].bounds[0],
  //   'label',
  //   label
  // );

  return {
    coords: coords[0].bounds[0],
    address: {
      street: street[0].toUpperCase() + street.substring(1),
      zip,
      city: cityOutput,
    },
  };
};

export const nextEmptyField = (input = null) => {
  let next = null;
  let refs = Array.isArray(input)
    ? [...input]
    : input && typeof input === 'object'
    ? Object.values(input)
    : [];

  for (let nth = 0; nth < refs.length; nth++) {
    if (refs[nth].value === '' || refs[nth].value.length < 1) {
      next = refs[nth];
      break;
    }
  }
  return next;
};

export const clickOutside = (node) => {
  const handleClick = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent('click_outside', node));
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
  };
};

export const emojiSymbol = (tag) =>
  emojis[`flag-${countriesLib[tag]}`] || emojis[tag] || tag;

export const itemPrototype = (id, key) => {
  const keys = {
    soupsLib,
    sidesLib,
    drinksLib,
    addonsLib,
  };
  return keys[key].find((s) => s.id === id);
};

export const dynamicEnterProps = (direction, range, duration = 350) => ({
  axis: direction === 'left' || direction === 'right' ? 'x' : 'y',
  startAt:
    direction === 'left' || direction === 'top'
      ? -range
      : direction === 'right' || direction === 'bottom'
      ? range
      : 50,
  duration,
  easing: expoInOut,
});

export const dynamicExitProps = (direction, range, duration = 350) => ({
  axis: direction === 'left' || direction === 'right' ? 'x' : 'y',
  startAt:
    direction === 'left' || direction === 'top'
      ? range
      : direction === 'right' || direction === 'bottom'
      ? -range
      : 50,
  duration,
  easing: expoIn,
});

export const dynamicEnter = (
  node,
  { axis, startAt, duration, easing, css = null }
) => ({
  [axis]: startAt,
  duration,
  easing,
  opacity: 0,
});

export const dynamicExit = (
  node,
  { axis, startAt, duration, easing, css = null }
) => ({
  [axis]: startAt,
  duration,
  easing,
  opacity: 0,
});

export const dynamicFly = (
  node,
  { axis, spawnEnter = 0, duration = 0, easing = expoIn, css }
) => {
  return {
    enter: {
      [axis]: spawnEnter,
      duration,
      easing,
      css: (t) => `z-index:2;opacity:${t};`,
    },
    exit: {
      [axis]: spawnEnter,
      duration,
      easing: expoIn,
      css: (t) => `z-index:0;opacity:${t};`,
    },
  };
};

export const onScrollHit = ({
  delayListener = 2000,
  range = 5,
  direction = 'bottom',
  path,
}) => {
  let onHit;
  let timeout;

  let prevY = 0;

  const after = () => {
    window.removeEventListener('scroll', compare);
    clearTimeout(timeout);
    window.removeEventListener('popstate', after);
    console.log('cleared listeners (onScrollHit)');
  };

  onHit = () => {
    navigate(path);
    after();
  };

  const compare = () => {
    const scrollH = document.documentElement.scrollHeight - window.innerHeight;
    const trueRange = direction === 'top' ? range : scrollH - range;

    if (window.scrollY < prevY) {
      // up
      if (window.scrollY < trueRange) {
        if (direction === 'top') {
          onHit();
        }
      }
    } else {
      // down
      if (window.scrollY > trueRange) {
        if (direction === 'bottom') {
          onHit();
        }
      }
    }
    prevY = window.scrollY;
  };

  window.addEventListener('scroll', compare);
  window.addEventListener('popstate', after);

  //timeout = setTimeout(init, delayListener);
};
