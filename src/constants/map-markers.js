export default [
  (coords) => ({
    coords,
    type: 'circle',
    props: {
      radius: 1,
      color: 'orange',
      fillColor: 'orange',
      weight: 10,
      opacity: 1,
    },
  }),
  (coords) => ({
    coords,
    type: 'circle',
    props: {
      radius: 1,
      color: 'green',
      fillColor: 'green',
      weight: 10,
      opacity: 1,
    },
  }),

  {
    coords: start,
    name: 'carrier',
    type: 'marker',
    props: {
      alt: 'sopp-budet',
      title: 'Din mat',
      icon: () => newIcon('food-delivery.svg'),
    },
  },
];
