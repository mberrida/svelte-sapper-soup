import UserType from './UserType.svelte';
import AddressInput from './AddressInput.svelte';
import AddressConfirm from './AddressConfirm.svelte';
import PaymentMethod from './PaymentMethod.svelte';
import Payment from './Payment.svelte';
import { stageDirection } from '../../store';

export default [
  {
    id: 'vem',
    title: 'Connectez-vous ou inscrivez-vous pour profiter des offres !',
    component: UserType,
    prev: { text: 'retour au panier', href: 'varukorg' },
    next: false,
    page: 'order',
  },
  {
    id: 'adress',
    title: 'Les coordonnées de livraison sont-elles correctes ?',
    component: AddressConfirm,
    prev: { text: 'retour', href: 'order~vem' },
    next: false,
    page: 'order',
  },
  {
    id: 'ange-adress',
    title: 'Adresse de livraison',
    component: AddressInput,
    prev: { text: 'retour', href: 'order~vem' },
    next: {
      text: 'terminé',
      href: 'order~adress',
      onClick: () => stageDirection.set('bottom'),
    },
    page: 'order',
  },
  {
    id: 'betalningsmetod',
    title: 'Comment souhaitez-vous payer ?',
    component: PaymentMethod,
    prev: { text: 'retour', href: 'order~adress' },
    next: false,
    page: 'order',
  },
  {
    id: 'betalning',
    title: 'Paiement en cours...',
    component: Payment,
    prev: { text: 'retour', href: 'order~betalningsmetod' },
    next: false,
    page: 'order',
  },
];
