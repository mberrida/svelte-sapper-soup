import SoupRemove from './SoupRemove.svelte';
import SoupAddon from './SoupAddon.svelte';
import SoupTemperature from './SoupTemperature.svelte';
import SoupExtra from './SoupExtra.svelte';

export default [
  {
    id: 'minus',
    title: 'Ta bort något?',
    component: SoupRemove,
    key: 0,
    page: 'ny-soppa',
  },
  {
    id: 'plus',
    title: 'Lägga till något?',
    component: SoupAddon,
    key: 1,
    page: 'ny-soppa',
  },
  {
    id: 'serveras',
    title: 'Hur vill du ha soppan?',
    component: SoupTemperature,
    key: 2,
    page: 'ny-soppa',
  },
  {
    id: 'tillval',
    title: 'Något extra?',
    component: SoupExtra,
    key: 3,
    page: 'ny-soppa',
  },
];
