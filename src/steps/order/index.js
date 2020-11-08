import UserType from './UserType.svelte';
import AddressInput from './AddressInput.svelte';
import AddressConfirm from './AddressConfirm.svelte';
import PaymentMethod from './PaymentMethod.svelte';
import Payment from './Payment.svelte';
import { stageDirection } from '../../store';

export default [
  {
    id: 'vem',
    title: 'Logga eller bli medlem för att ta del av erbjudanden!',
    component: UserType,
    prev: { text: 'tillbaka till varukorgen', href: 'varukorg' },
    next: false,
    page: 'order',
  },
  {
    id: 'adress',
    title: 'Stämmer leveransadressen?',
    component: AddressConfirm,
    prev: { text: 'tillbaka', href: 'order~vem' },
    next: false,
    page: 'order',
  },
  {
    id: 'ange-adress',
    title: 'Leveransadress',
    component: AddressInput,
    prev: { text: 'tillbaka', href: 'order~vem' },
    next: {
      text: 'klar',
      href: 'order~adress',
      onClick: () => stageDirection.set('bottom'),
    },
    page: 'order',
  },
  {
    id: 'betalningsmetod',
    title: 'Hur vill du betala?',
    component: PaymentMethod,
    prev: { text: 'tillbaka', href: 'order~adress' },
    next: false,
    page: 'order',
  },
  {
    id: 'betalning',
    title: 'Betalning...',
    component: Payment,
    prev: { text: 'tillbaka', href: 'order~betalningsmetod' },
    next: false,
    page: 'order',
  },
];
