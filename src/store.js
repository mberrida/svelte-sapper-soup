import { writable, readable } from 'svelte/store';
import { timeStamp } from './utils/helpers';
import {
  initialMeta,
  initialSoups,
  initialSides,
  initialDrinks,
} from './constants/cart-preset';

/* Cart */

export const cartSoups = writable(initialSoups(), () => {
  // console.log('subscribed to cartMeta');
  return () => () => {}; // console.log('stopped subscribing to cartMeta.');
});

export const cartSides = writable(initialSides(), () => {
  // console.log('subscribed to cartSides');
  return () => () => {}; // console.log('stopped subscribing to cartSides.');
});

export const cartDrinks = writable(initialDrinks(), () => {
  // console.log('subscribed to cartDrinks');
  return () => () => {}; // console.log('stopped subscribing to cartDrinks.');
});

export const cartMeta = writable(initialMeta(), () => {
  // console.log('subscribed to cartMeta');
  return () => () => {}; // console.log('stopped subscribing to cartMeta.');
});

export const emptyCart = () => {
  cartSoups.set(initialSoups());
  cartSides.set(initialSides());
  cartDrinks.set(initialDrinks());
  cartMeta.set(initialMeta());

  console.log('CLEARED CART');
};

const updateMeta = (category, products, meta) => {
  //console.log('cat', category, 'produts', products, 'meta', meta);
  const newMeta = products.reduce(
    (res, next) => {
      return {
        count: res.count + (category === 'soups' ? 1 : next.amount),
        price:
          category === 'soups'
            ? res.price + (next.price || next.proto.price)
            : res.price + next.price * next.amount,
      };
    },
    { count: 0, price: 0 }
  );

  const newTotalCount = meta.count.total - meta.count[category] + newMeta.count;
  const newTotalPrice = meta.price.total - meta.price[category] + newMeta.price;

  return {
    ...meta,
    count: { ...meta.count, total: newTotalCount, [category]: newMeta.count },
    price: { ...meta.price, total: newTotalPrice, [category]: newMeta.price },
    updated: timeStamp(['updated sides']),
  };
};

// sync cart meta
const byeCartSoups = cartSoups.subscribe((soups) => {
  cartMeta.update((meta) => {
    return updateMeta('soups', soups, meta);
  });

  // console.log('Updated cart meta (soups)', soups.length);

  return () => {}; // console.log('unsubscribed to cartSoups');
});

const byeCartSides = cartSides.subscribe((sides) => {
  cartMeta.update((meta) => {
    return updateMeta('sides', sides, meta);
  });

  // console.log(
  //   'Updated cart meta (sides)',
  //   sides.reduce((tot, next) => tot + next.amount, 0)
  // );

  return () => {}; // console.log('unsubscribed to cartSides');
});
const byeCartDrinks = cartDrinks.subscribe((drinks) => {
  cartMeta.update((meta) => {
    return updateMeta('drinks', drinks, meta);
  });

  // console.log(
  //   'Updated cart meta (drinks)',
  //   drinks.reduce((tot, next) => tot + next.amount, 0)
  // );

  return () => {}; // console.log('unsubscribed to cartDrinks');
});

export const tempConfirmationCart = writable(null, () => {
  // console.log('subscribed to tempConfirmationCart');
  return () => () => {}; // console.log('stopped subscribing to tempConfirmationCart.');
});

/* // CART */

export const title = readable('Online Soup Delivery');
export const slogan = readable('simple - tasty - healthy');

export const stage = writable(null, () => {
  // console.log('subscribed to stage');
  return () => () => {}; // console.log('stopped subscribing to stage.');
});

export const stageDirection = writable('right', () => {
  // console.log('subscribed to stage direction.');
  return () => () => {}; // console.log('stopped subscribing to stage direction.');
});

export const currentPath = writable(undefined, () => {
  // console.log('subscribed to current path!');
  return () => () => {}; // console.log('stopped subscribing to current path.');
});

export const orderStage = writable(0, () => {
  // console.log('subscribed to orderStage!');
  return () => () => {}; // console.log('stopped subscribing to orderStage.');
});

export const viewport = writable({}, () => {
  // console.log('subscribed to viewport.');
  return () => () => {}; // console.log('stopped subscribing to viewport.');
});

export const soupPrototype = writable(null, () => {
  // console.log('subscribed to soup prototype.');
  return () => () => {}; // console.log('stopped subscribing to soup prototype.');
});

export const currentSoup = writable(null /* { ...exampleSoup } */, () => {
  // console.log('subscribed to current soup');
  return () => () => {}; // console.log('stopped subscribing to current soup');
});

export const editMode = writable(false, () => {
  // console.log('subscribed to edit mode');
  return () => () => {}; // console.log('stopped subscribing to edit mode');
});

export const syncCartMeta = writable(true, () => {
  // console.log('subscribed to Sync cart meta');
  return () => () => {}; // console.log('stopped subscribing to Sync cart meta');
});

export const activeStep = writable({}, () => {
  // console.log('subscribed to Active step');
  return () => () => {}; // console.log('stopped subscribing to Active step');
});

export const prevStepDisabled = writable(false, () => {
  // console.log('subscribed to Prev step disabled');
  return () => () => {}; // console.log('stopped subscribing to Prev step disabled');
});

export const nextStepDisabled = writable(false, () => {
  // console.log('subscribed to Next step disabled');
  return () => () => {}; // console.log('stopped subscribing to Next step disabled');
});

export const justAddedToCart = writable(false, () => {
  // console.log('subscribed to Just added to cart');
  return () => () => {}; // console.log('stopped subscribing to Just added to cart');
});

export const menuIndex = writable(0, () => {
  // console.log('subscribed to Menu index');
  return () => () => {}; // console.log('stopped subscribing to Menu index');
});

export const detailsOpen = writable(false, () => {
  // console.log('subscribed to Details open');
  return () => () => {}; // console.log('stopped subscribing to Details open');
});

export const currentUser = writable({}, () => {
  // console.log('subscribed to Current address');
  return () => () => {}; // console.log('stopped subscribing to Current address');
});

export const currentAddress = writable({}, () => {
  // console.log('subscribed to Current address');
  return () => () => {}; // console.log('stopped subscribing to Current address');
});

export const currentCard = writable({}, () => {
  // console.log('subscribed to Current card');
  return () => () => {}; // console.log('stopped subscribing to Current card');
});

export const enter = writable(
  () => ({ x: 50, duration: 400 }),
  () => {
    // console.log('subscribed to Page enter');
    return () => () => {}; // console.log('stopped subscribing to Page enter');
  }
);

export const exit = writable(
  () => ({ x: -50, duration: 400 }),
  () => {
    // console.log('subscribed to Page exit');
    return () => () => {}; // console.log('stopped subscribing to Page exit');
  }
);

export const modal = writable(null, () => {
  // console.log('subscribed to Modal');
  return () => () => {}; // console.log('stopped subscribing to Modal');
});

export const delivered = writable(false, () => {
  // console.log('subscribed to delivered');
  return () => () => {}; // console.log('stopped subscribing to delivered');
});

export const Lstored = writable(null, () => {
  // console.log('subscribed to Lstored');
  return () => () => {}; // console.log('stopped subscribing to Lstored');
});

export const streetMap = writable(null, () => {
  // console.log('subscribed to streetMap');
  return () => () => {}; // console.log('stopped subscribing to streetMap');
});

export const headerHeight = writable(null, () => {
  // console.log('subscribed to headerHeight');
  return () => () => {}; // console.log('stopped subscribing to headerHeight');
});

export const carrierData = writable(null, () => {
  // console.log('subscribed to carrierData');
  return () => () => {}; // console.log('stopped subscribing to carrierData');
});

export const validStreet = writable(null, () => {
  // console.log('subscribed to validStreet');
  return () => () => {}; // console.log('stopped subscribing to validStreet');
});
