export const nutrition = [
  {
    name: 'kalorier',
    value: 50,
    unit: 'kcal',
  },
  {
    name: 'proteiner',
    value: 2,
    unit: 'g',
  },
  {
    name: 'kolhydrater',
    value: 3.9,
    unit: 'g',
    children: [
      {
        name: 'fibrer',
        value: 1,
        unit: 'g',
      },
      {
        name: 'sockerarter',
        value: 2.7,
        unit: 'g',
      },
    ],
  },
  {
    name: 'fett',
    value: 3.3,
    unit: 'g',
    children: [
      {
        name: 'mättat',
        value: 1.8,
        unit: 'g',
      },
      {
        name: 'enkelomättat',
        value: 0.9,
        unit: 'g',
      },
      {
        name: 'fleromättat',
        value: 0.2,
        unit: 'g',
      },
    ],
  },
];

export default [
  {
    name: 'ramen',
    content: ['kyckling', 'nudlar', 'ägg'],
    description: 'Vår ramen är lagad med kärlek',
    nutrition,
    img:
      'https://images.unsplash.com/photo-1597933593749-fba737c268c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
    category: 'meat',
    tags: ['meat', 'japan', 'asia', 'noudles', 'chicken', 'classic'],
    id: 'ramen',
    price: 75,
  },
  {
    name: 'swedish köttsoppa',
    content: ['nötkött', 'rotfrukter', 'vitkål'],
    description: 'Swedish köttsoppa är en riktig klassiker',
    nutrition,
    img:
      'https://images.unsplash.com/photo-1580694129446-25862b43c178?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
    category: 'meat',
    tags: ['meat', 'classic', 'sweden'],
    id: 'swedish-meat',
    price: 65,
  },
  {
    name: 'japansk lax',
    content: ['lax', 'äggnudlar', 'sjögräs', 'soya', 'kokos-mousse'],
    description: 'Äkta japansk grace',
    nutrition,
    img: 'img/soup/salmon.jpg',
    category: 'veg',
    tags: ['fish', 'japan', 'salmon', 'seagrass', 'egg'],
    id: 'lax',
    price: 85,
  },
  {
    name: 'gulasch',
    content: ['potatis', 'morötter', 'tomat', 'paprika', 'vita bönor'],
    description:
      'Vår ramen är precis vad du förväntar dig, plus det lilla extra',
    nutrition,
    img: 'img/soup/gulasch.jpg',
    category: 'veg',
    tags: ['vegetarian', 'hungary'],
    id: 'gulasch',
    price: 75,
  },
  {
    name: 'morot-ingefära',
    content: [
      'morötter',
      'ingefära',
      'vitlök',
      'gul lök',
      'kokosmjölk',
      'halloumi',
      'chili',
    ],
    description: 'Vår utsökta morotssoppa, med lagom riv i',
    nutrition,
    img: 'img/soup/carrot-ginger.jpg',
    category: 'veg',
    tags: ['vegetarian', 'carrot', 'ginger', 'chili'],
    id: 'morot',
    price: 70,
  },
  {
    name: 'swedish skogs-champinjon',
    content: [
      'skogschampinjoner',
      'jordärtskockor',
      'bananschalottenlök',
      'färsk timjan',
      'grädde',
    ],
    description: 'Vår utsökta morotssoppa, med lagom riv i',
    nutrition,
    img: 'img/soup/mushroom.jpg',
    category: 'veg',
    tags: ['vegetarian', 'mushroom', 'sweden', 'creamy'],
    id: 'champinjon',
    price: 70,
  },
];
