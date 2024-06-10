export const nutrition = [
  {
    name: 'calories',
    value: 50,
    unit: 'kcal',
  },
  {
    name: 'protéines',
    value: 2,
    unit: 'g',
  },
  {
    name: 'glucides',
    value: 3.9,
    unit: 'g',
    children: [
      {
        name: 'fibres',
        value: 1,
        unit: 'g',
      },
      {
        name: 'glucides simples',
        value: 2.7,
        unit: 'g',
      },
    ],
  },
  {
    name: 'matières grasses',
    value: 3.3,
    unit: 'g',
    children: [
      {
        name: 'saturées',
        value: 1.8,
        unit: 'g',
      },
      {
        name: 'monoinsaturées',
        value: 0.9,
        unit: 'g',
      },
      {
        name: 'polyinsaturées',
        value: 0.2,
        unit: 'g',
      },
    ],
  },
];


export default [
  {
    name: 'ramen',
    content: ['poulet', 'nouilles', 'œuf'],
    description: 'Notre ramen est préparée avec amour',
    nutrition,
    img:
      'https://images.unsplash.com/photo-1597933593749-fba737c268c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
    category: 'viande',
    tags: ['viande', 'japon', 'asie', 'nouilles', 'poulet', 'classique'],
    id: 'ramen',
    price: 75,
  },
  {
    name: 'soupe suédoise à la viande',
    content: ['bœuf', 'légumes racines', 'chou blanc'],
    description: 'La soupe suédoise à la viande est un classique authentique',
    nutrition,
    img:
      'https://images.unsplash.com/photo-1580694129446-25862b43c178?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
    category: 'viande',
    tags: ['viande', 'classique', 'suède'],
    id: 'soupe-viande-suedoise',
    price: 65,
  },
  {
    name: 'saumon japonais',
    content: ['saumon', 'nouilles aux œufs', 'algues marines', 'soja', 'mousse de coco'],
    description: 'La véritable grâce japonaise',
    nutrition,
    img: 'img/soup/salmon.jpg',
    category: 'végé',
    tags: ['poisson', 'japon', 'saumon', 'algues marines', 'œuf'],
    id: 'saumon',
    price: 85,
  },
  {
    name: 'goulash',
    content: ['pommes de terre', 'carottes', 'tomate', 'poivron', 'haricots blancs'],
    description: 'Notre goulash est exactement ce à quoi vous vous attendez, avec une petite touche supplémentaire',
    nutrition,
    img: 'img/soup/gulasch.jpg',
    category: 'végé',
    tags: ['végétarien', 'hongrie'],
    id: 'goulash',
    price: 75,
  },
  {
    name: 'carotte-gingembre',
    content: [
      'carottes',
      'gingembre',
      'ail',
      'oignon jaune',
      'lait de coco',
      'halloumi',
      'piment',
    ],
    description: 'Notre délicieuse soupe à la carotte, avec juste ce qu\'il faut de piquant',
    nutrition,
    img: 'img/soup/carrot-ginger.jpg',
    category: 'végé',
    tags: ['végétarien', 'carotte', 'gingembre', 'piment'],
    id: 'carotte-gingembre',
    price: 70,
  },
  {
    name: 'champignon forestier suédois',
    content: [
      'champignons forestiers',
      'topinambours',
      'échalotes bananes',
      'thym frais',
      'crème',
    ],
    description: 'Notre délicieuse soupe aux champignons, avec juste ce qu\'il faut de crémeux',
    nutrition,
    img: 'img/soup/mushroom.jpg',
    category: 'végé',
    tags: ['végétarien', 'champignon', 'suède', 'crémeux'],
    id: 'champignon',
    price: 70,
  },
  
];
