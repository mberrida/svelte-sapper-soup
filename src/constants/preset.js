import { timeStamp } from '../utils/helpers';
import soupsLib from './soups-lib';

export const orderStages = [
  {
    stage: 0,
    name: 'created',
    title: 'Betalad',
  },
  {
    stage: 1,
    name: 'preparing',
    title: 'Tillagas',
  },
  {
    stage: 2,
    name: 'delivering',
    title: 'På väg',
  },
  {
    stage: 3,
    name: 'delivered',
    title: 'Levererad',
  },
];

export const statusStages = [
  'Order mottagen',
  'Tillagning pågår',
  'Leverans pågår',
  'Levererad',
];

export const soupTemplate = (
  proto = soupsLib[Math.floor(Math.random() * soupsLib.length)]
) => ({
  id: Date.now(),
  created: timeStamp(),
  updated: timeStamp(),
  removed: [],
  addons: [],
  served: 'hot',
  notes: '',
  price: proto.price,
  proto: { ...proto },
});

export const coords = {
  soupFactory: [59.333545, 18.075644],
  destination: [59.3335, 18.0756],
};

export const markerData = {
  A: {
    coords: coords.soupFactory,
    type: 'circle',
    props: {
      radius: 1,
      color: 'orange',
      fillColor: 'orange',
      weight: 10,
      opacity: 1,
      title: 'Soppfabriken',
    },
  },
  B: {
    coords: coords.destination,
    type: 'circle',
    props: {
      radius: 1,
      color: 'green',
      fillColor: 'green',
      weight: 10,
      opacity: 1,
      title: 'Leveransadress',
    },
  },
  carrier: {
    coords: coords.soupFactory,
    type: 'AnimatedMarker',
    props: {
      alt: 'sopp-budet',
      title: 'Din mat',
    },
    popup: `
        Icons made by
        <a
          href="https://www.flaticon.com/authors/freepik"
          title="Freepik"
        >
          Freepik
        </a>
        from 
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>
      `,
  },
};

export const credits = [
  {
    key: `Pot-icon, footer`,
    val: `Icons made by <a href="Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>`,
  },
  {
    key: 'User-icon, footer',
    val: `Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>`,
  },
  {
    key: 'Info-icon, footer',
    val: `Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>`,
  },

  {
    key: `Login-icon, footer`,
    val: `Icons made by <a href="https://icon54.com/" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>`,
  },
  {
    key: `Register-icon, footer`,
    val: `Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>`,
  },
  {
    key: `Admin-icon, footer`,
    val: `Icons made by <a href="https://www.flaticon.com/free-icon/vr-glasses_2304514" title="itim2101">itim2101</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>`,
  },
  {
    key: `Cart-icon, header`,
    val: `Icons made by <a href="https://www.flaticon.com/free-icon/vr-glasses_2304514" title="itim2101">itim2101</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>`,
  },
  {
    key: `Order-status-icons, kvitto-page`,
    val: `Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>`,
  },
];
