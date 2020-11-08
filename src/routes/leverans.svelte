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

      const res = await fetched.json();

      // console.log('my latest order res status', res.status);

      return { user, order: res.order || null };
    }
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { goto, stores } from '@sapper/app';
  import Map from '../components/Map.svelte';
  import { geoSearch } from '../utils/dynamicImport';
  import {
    activeStep,
    currentAddress,
    Lstored,
    streetMap,
    delivered,
    stageDirection,
    enter,
    exit,
    tempConfirmationCart,
  } from '../store';
  import { orderStages } from '../constants/preset';
  import { clone } from '../utils/helpers';
  import StepNav from '../components/StepNav.svelte';
  import StepNavBtn from '../components/StepNavBtn.svelte';
  import StepNavSpace from '../components/StepNavSpace.svelte';
  const { session } = stores();

  export let user = null;
  export let order = null;

  $: if (!order && $tempConfirmationCart) {
    order = $tempConfirmationCart;
  }
  $: if (!user && $tempConfirmationCart) {
    user = $tempConfirmationCart.user;
  }

  let orderIsActive = true;

  $: if (order) {
    if (order.status.stage === 3) orderIsActive = false;
  }

  let visible = false;
  let mounted = false;

  onMount(async () => {
    if (!$Lstored) Lstored.set(L || window.L);
    if (!$streetMap)
      streetMap.set(new (await geoSearch()).OpenStreetMapProvider());
    mounted = true;
  });

  const updateOrder = async (order) => {
    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'updateOrder',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    const res = await fetched.json();

    // console.log('update order res status', res.status);

    if (res.status !== 200) {
      console.error('Failed to update order in DB', res.error, res.msg);
      return false;
    }

    // console.log('Order updated in DB', order.status.stage);
  };

  const markAsDelivered = async () => {
    // console.log('marking as delivered...');
    const newOrder = { ...order, status: orderStages[3] };

    await updateOrder(newOrder);
  };

  $: if ($delivered) {
    markAsDelivered();
  }

  $: img = $delivered
    ? 'img/icon/waiter.svg'
    : !order
    ? 'img/empty-soup.png'
    : order.status.stage === 3
    ? 'delivered.svg'
    : 'img/icon/carrier-east.svg';

  $: status = $delivered
    ? ['Levererad!', 'Smaklig måltid :)']
    : !order
    ? ['Du har ingen aktiv order', '']
    : order.status.stage === 3
    ? [
        `Din senaste order levererades <br/> ${order.dueDate.date} ${order.dueDate.time}`,
        'Hoppas det smakade :)',
      ]
    : ['På väg!', ''];
</script>

<svelte:head>
  <title>Svelte Sapper Soup! Aktiv leverans</title>
</svelte:head>

<div
  class="leveransstatus"
  in:fly="{$enter({ delay: 200 })}"
  out:fly="{$exit()}"
>
  {#if mounted && $Lstored && user && order}
    {#if $Lstored.Routing && $Lstored.Marker.MovingMarker && !$delivered && order.status.stage < 3}
      <h2 class="map-status">
        {@html status[0]}
      </h2>
      <Map
        destination="{$currentAddress.street}"
        L="{$Lstored}"
        order="{order}"
      />
    {:else}
      <h1>Leveransstatus</h1>

      <h2 class="status">
        {@html status[0]}
      </h2>
      <img class="status-img" src="{img}" alt="{img}" />

      <h2 class="status">
        {@html status[1]}
      </h2>
    {/if}
  {:else}
    <div class="fail">
      <h1>Vi hittade ingen aktiv order registrerad på dig</h1>

      <img src="img/empty-soup.png" alt="empty soup" />
    </div>
  {/if}

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
    {user && order ? 'Hem' : 'Till Sopporna!'}
  </StepNavBtn>

  {#if user && order}
    <StepNavBtn
      href="kvitto"
      onClick="{() => stageDirection.set('right')}"
      flex="1"
    >
      Kvitto
    </StepNavBtn>
  {/if}
</StepNav>

<style>
  :global(.leaflet-pane) {
    z-index: 4;
  }

  .leveransstatus {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 0;
  }

  .map-status {
    position: fixed;
    width: 100%;
    background: rgba(255, 255, 255, 0.5);
    font-size: var(--theme-title-fontSize-third);
  }

  .status-img {
    margin: 10px auto;
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
