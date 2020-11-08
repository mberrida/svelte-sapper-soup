import { writable } from 'svelte/store';
import { tryCallback, timeStamp, clone } from '../utils/helpers';
import protoSoups from './soups-lib';
import addonsLib from './addons-lib';
import sidesLib from './sides-lib';
import drinksLib from './drinks-lib';

const exampleSoup = (diff = 0) => ({
  id: Date.now() + diff,
  created: timeStamp(),
  updated: timeStamp(),
  removed: protoSoups[diff].content.map((r) => ({ name: r, removed: true })),
  addons: addonsLib,
  served: 'hot',
  notes: '',
  price:
    protoSoups[diff].price +
    addonsLib.reduce((tot, next) => {
      return tot + next.price;
    }, 0),
  proto: { ...protoSoups[diff] },
});

export const exampleDrink = {
  amount: 3,
  currency: 'kr',
  id: 'drink-1',
  img:
    'https://icon2.cleanpng.com/20171220/ree/coca-cola-bottle-png-image-5a3ac111117330.71397511151379995307157705.jpg',
  name: 'coca cola',
  price: 25,
  unit: 'cl',
};

export const exampleSide = {
  amount: 3,
  currency: 'kr',
  id: 'side-1',
  img:
    'https://www.thespruceeats.com/thmb/KqRuKQyYNd1fbFgZO5CoFI3dUEc=/2533x2533/smart/filters:no_upscale()/native-american-fry-bread-4045432-hero-01-abd3bc3a888d49e393c42245fdbf7e68.jpg',
  name: 'bröd',
  price: 15,
  unit: 'st',
};

export const initialSoups = (empty = true) => (empty ? [] : [exampleSoup()]);

export const initialSides = (empty = true) =>
  sidesLib.map((s) => ({ ...s, amount: empty ? 0 : 1 }));

export const initialDrinks = (empty = true) =>
  drinksLib.map((d) => ({ ...d, amount: empty ? 0 : 1 }));

export const initialMeta = () => ({
  id: Date.now(),
  created: timeStamp(),
  updated: timeStamp(),
  count: {
    total: 0,
    soups: 0,
    drinks: 0,
    sides: 0,
  },
  price: {
    total: 0,
    soups: 0,
    drinks: 0,
    sides: 0,
  },
});
