<script context="module">
  export async function preload(page, { user, BACKEND_URL }) {
    const fetched = await this.fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'myOrders',
        _url: BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
      }),
    });

    const res = await fetched.json();

    // console.log('my orders res status', res.status);

    return { user, orders: res.orders || [] };
  }
</script>

<script>
  import { fly, slide } from 'svelte/transition';
  import { activeStep, enter, exit, viewport } from '../store';
  import OrderList from '../components/OrderList.svelte';
  import Icon from '../components/Icon.svelte';
  import ProductList from '../components/ProductList.svelte';
  import { orderStatusMsg } from '../utils/helpers';

  export let orders;
  export let user;

  const active = Array.isArray(orders)
    ? orders
        .filter((o) => o.status.stage < 3)
        .sort((a, b) =>
          a.updated.date < b.updated.date
            ? 1
            : a.updated.date > b.updated.date
            ? -1
            : a.updated.time < b.updated.time
            ? 1
            : -1
        )
    : [];

  const past = Array.isArray(orders)
    ? orders
        .filter((o) => o.status.stage === 3)
        .sort((a, b) =>
          a.updated.date < b.updated.date
            ? 1
            : a.updated.date > b.updated.date
            ? -1
            : a.updated.time < b.updated.time
            ? 1
            : -1
        )
    : [];

  const bg = {
    active: {
      primary: 'var(--theme-background-pop-primary)',
      secondary: 'var(--theme-background-pop-third)',
    },
    past: {
      primary: 'var(--theme-background-grey-primary)',
      secondary: 'var(--theme-background-grey-third)',
    },
  };
</script>

<svelte:head>
  <title>Svelte Sapper Soup! Mina ordrar</title>
</svelte:head>

<div
  class="container mina-ordrar"
  style="width:{$viewport.width - 10}px;"
  in:fly="{$enter()}"
  out:fly="{$exit()}"
>
  <h1>Mina ordrar</h1>

  <h2>Aktiva ({active.length})</h2>
  <div class="list">
    <OrderList orders="{active}" user="{user}" bg="{bg.active}" />
  </div>

  <h2>Levererade ({past.length})</h2>
  <div class="list">
    <OrderList orders="{past}" user="{user}" bg="{bg.past}" />
  </div>

  <div class="footer-space"></div>
</div>

<style>
  .container.mina-ordrar {
    display: flex;
    flex-direction: column;
    padding: 5px;
    max-width: 1000px;
    align-self: center;
  }
  .list {
    display: grid;
    row-gap: 10px;
    margin-bottom: 50px;
  }

  .footer-space {
    height: var(--theme-footer-height);
    width: 100%;
  }
</style>
