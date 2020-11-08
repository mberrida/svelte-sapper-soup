<script context="module">
  export async function preload(page, { user, BACKEND_URL }) {
    if (user) {
      const fetched = await this.fetch('fetch/post', {
        method: 'POST',
        headers: {
          _action: 'myLatestOrder',
          _url: BACKEND_URL,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const { order } = await fetched.json();

      return { user, order };
    }
  }
</script>

<script>
  import { fly, slide } from 'svelte/transition';
  import StepNav from '../components/StepNav.svelte';
  import StepNavSpace from '../components/StepNavSpace.svelte';
  import StepNavBtn from '../components/StepNavBtn.svelte';
  import {
    cartMeta,
    stageDirection,
    viewport,
    enter,
    exit,
    delivered,
  } from '../store';
  import Icon from '../components/Icon.svelte';
  import ProductList from '../components/ProductList.svelte';
  import { orderStatusMsg } from '../utils/helpers';
  import { tempConfirmationCart } from '../store';

  export let order = $tempConfirmationCart;
  export let user = null;

  $: if (!user && $tempConfirmationCart) {
    user = $tempConfirmationCart.user;
  }

  let statusMsg = {
    status: 'Vi hittade inte någon order registrerad på dig/ditt konto.',
    due: '',
    img: 'img/empty-soup.png',
  };

  $: if (order) {
    statusMsg = orderStatusMsg(order.status.stage, statusMsg);
  }

  let orderOpen = false;
</script>

<svelte:head>
  <title>Svelte Sapper Soup! Bekräftelse</title>
</svelte:head>

<div
  class="kvitto"
  style="width:{$viewport.width - 10}px;"
  in:fly="{$enter({ delay: 200 })}"
  out:fly="{$exit()}"
>
  <h1>Orderbekräftelse</h1>
  {#if order && user}
    <div class="meta">
      <p>
        <span class="label">Status:</span>
        {statusMsg.status}
        <img
          class="status-img"
          src="{statusMsg.img}"
          alt="{statusMsg.img.substr(0, -4)} image"
        />
      </p>
      <p>
        <span class="label">Beställningsdatum:</span>
        {order.created.date}
        {order.created.time}
      </p>
      <p>
        <span class="label">{statusMsg.due}:</span>
        {order.dueDate.date}
        {order.dueDate.time}
      </p>

      <div class="customer">
        <p class="label">Beställare:</p>
        <p>{user.firstName} {user.lastName}</p>
        <p>{user.email}</p>
        <p>
          <span class="label">Kundnr:</span>
          {user.id === 'guest' ? 'ej kund' : user.id}
        </p>
      </div>
      <p>
        <span class="label">Betalningsmetod:</span>
        {order.paymentMethod || 'kort'}
      </p>
      <div class="address">
        <p class="label">Leveransadress:</p>

        <p>{order.address.firstName} {order.address.lastName}</p>
        <p>{order.address.street}</p>
        <p>{order.address.zip} {order.address.city}</p>
        {#if order.address.notes}
          <p>
            <span class="label">instruktioner/portkod:</span>
            "{order.address.notes}"
          </p>
        {/if}
      </div>
    </div>
    <button class="toggle-panel" on:click="{() => (orderOpen = !orderOpen)}">
      <p>Varor</p>
      <Icon
        icon="angleDown"
        color="var(--theme-color-primary)"
        width="auto"
        transform="{orderOpen ? 'rotate(180deg)' : 'rotate(0deg)'}"
      />
    </button>
    {#if orderOpen}
      <div class="order-container" transition:slide>
        <ProductList
          soups="{order.items.soups}"
          sides="{order.items.sides}"
          drinks="{order.items.drinks}"
          meta="{order.items.meta}"
          orderStatus="{order.status}"
          total="{false}"
        />
      </div>
    {/if}
    <p class="total">{order.items.meta.price.total}kr</p>
  {:else}
    <div class="fail">
      <h1>{statusMsg.status}</h1>
      <img src="{statusMsg.img}" alt="{statusMsg.img.substr(0, -4)} image" />
    </div>
  {/if}
  <StepNavSpace />
  <StepNavSpace />
</div>

<StepNav>
  <StepNavBtn
    primary="{false}"
    href="/"
    onClick="{() => stageDirection.set('left')}"
    flex="1"
    border="none"
  >
    {order && user ? 'Hem' : 'Till sopporna!'}
  </StepNavBtn>

  {#if order && user}
    <StepNavBtn
      href="leverans"
      onClick="{() => stageDirection.set('right')}"
      flex="1"
    >
      Leverans
    </StepNavBtn>
  {/if}
</StepNav>

<style>
  :global(.leaflet-pane) {
    z-index: 4;
  }

  .kvitto {
    display: flex;
    flex-direction: column;
    align-self: center;
    align-items: center;
    padding: 5px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .meta,
  .address,
  .customer {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .status-img {
    max-width: 30px;
    margin: 0 auto;
  }

  .address,
  .customer {
    margin: 1em 0;
  }

  .meta,
  .toggle-panel {
    margin-bottom: 1em;
    min-height: fit-content;
  }

  .meta p {
    font-style: italic;
  }

  .meta .label {
    font-weight: 700;
    font-style: normal;
  }

  .address > p,
  .customer > p {
    margin: 0;
  }

  .toggle-panel {
    width: 100%;
    border: var(--theme-border-primary);
    outline: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .order-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .total {
    text-decoration: underline;
    font-size: var(--theme-title-fontSize-primary);
    margin: 10px 0;
  }

  .fail {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .fail > *:not(:last-child) {
    margin-bottom: 10vh;
  }

  .fail > img {
    width: 80%;
    max-width: 200px;
  }
</style>
