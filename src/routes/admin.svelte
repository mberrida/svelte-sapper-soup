<script context="module">
  import OrderSingle from '../components/OrderSingle.svelte';
  import { httpResMSg } from '../utils/helpers';
  export async function preload(page, { user }) {
    let isAdmin = false;

    if (user) {
      isAdmin = user.roles.indexOf('admin') > -1;
    }

    if (!isAdmin) {
      return this.redirect(302, '/');
    }
  }
</script>

<script>
  import { stores } from '@sapper/app';
  import { onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  import { crossfade, fly } from 'svelte/transition';
  import { orderStages } from '../constants/preset';
  import { timeStamp, clone } from '../utils/helpers';
  import { stage } from '../store';
  import StepNavSpace from '../components/StepNavSpace.svelte';
  import Logo from '../components/Logo.svelte';

  const { session } = stores();

  let promise = null;

  let busy = false;

  let visibleOrder = false;

  const getOrders = async () => {
    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'adminOrders',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: $session.user.id,
      }),
    });

    let orders = [];

    // console.log('orders res', fetched.status);

    if (fetched.status === 200) {
      orders = (await fetched.json()).orders;
      // console.log('orders res res', orders);
    }

    return orders;
  };

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

    if (res.status !== 200 || res.error)
      return console.error('Failed to update order in DB', res.error, res.msg);

    // console.log('order successfully updated in DB');

    busy = false;
  };

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 400),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
      };
    },
  });

  const moveOrder = (id, move) => {
    busy = true;

    if (!id || typeof move !== 'number')
      return console.log('must provide id and move-val to move order');

    const index = promise.findIndex((o) => o._id === id);
    const order = promise.find((o) => o._id === id);
    if (index < 0 || !order) return console.log('could not find order to move');

    const newStatus = orderStages[order.status.stage + move];
    if (!newStatus) return console.log('New status-index is invalid');

    visibleOrder = false;

    order.status = { ...(order - container.status), ...newStatus };

    promise[index] = order;

    updateOrder(order);
  };

  const onDelete = async () => {
    promise = (await getOrders()) || [];
  };

  onMount(async () => {
    promise = (await getOrders()) || [];
  });
</script>

<svelte:head>
  <title>Svelte Sapper Soup! Admin - Hantera ordrar</title>
</svelte:head>

<div class="container admin">
  <Logo />
  <h1>Order-översikt</h1>

  {#await promise}
    <p class="info">Laddar ordrar...</p>
  {:then orders}
    {#if orders}
      {#each orderStages as { stage, title } (stage)}
        <div class="col active stage-{stage}">
          <h2>{title}</h2>
          {#each orders.filter((o) => o.status.stage === stage) as o (o._id)}
            <div
              class="order-container"
              in:receive="{{ key: o._id }}"
              out:send="{{ key: o._id }}"
              animate:flip="{{ duration: 400 }}"
            >
              {#if visibleOrder !== o._id}
                <button
                  class="prev move-btn"
                  class:open="{visibleOrder === o._id}"
                  class:stroke="{o.status.stage === 0}"
                  disabled="{busy || o.status.stage === 0}"
                  on:click="{() => moveOrder(o._id, -1)}"
                  transition:fly="{{ x: -50 }}"
                >prev</button>
              {/if}
              <div
                class="content"
                class:stage0="{o.status.stage === 0}"
                class:stage1="{o.status.stage === 1}"
                class:stage2="{o.status.stage === 2}"
                class:stage3="{o.status.stage === 3}"
                class:open="{visibleOrder === o._id}"
                on:click="{() => {
                  visibleOrder = visibleOrder === o._id ? false : o._id;
                }}"
              >
                <OrderSingle
                  isOpen="{visibleOrder === o._id}"
                  order="{o}"
                  deleteCb="{onDelete}"
                />
              </div>
              {#if visibleOrder !== o._id}
                <button
                  class="next move-btn"
                  class:open="{visibleOrder === o._id}"
                  class:stroke="{o.status.stage === 3}"
                  disabled="{busy || o.status.stage === 3}"
                  on:click="{() => moveOrder(o._id, 1)}"
                  transition:fly="{{ x: 50 }}"
                  style="position:{visibleOrder === o._id ? 'absolute' : 'relative'};"
                >next</button>
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    {:else}
      <p class="info">Laddar ordrar...</p>
      <!-- cos svelte bug -->
    {/if}
  {:catch}
    <p class="info">Ordarna kunde inte hämtas.</p>
  {/await}
</div>

<style>
  .container.admin {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
    width: 90%;
    min-width: 1200px;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 50px;
  }

  h1 {
    grid-column-start: 1;
    grid-column-end: 6;
  }

  h2 {
    font-weight: 200;
    user-select: none;
    margin: 0 0 0.5em 0;
  }

  .stage-0 > h2 {
    color: var(--theme-color-blue-primary);
  }

  .stage-1 > h2 {
    color: var(--theme-color-pop-secondary);
  }

  .stage-2 > h2 {
    color: var(--theme-color-pop-primary);
  }

  .stage-3 > h2 {
    color: var(--theme-color-success-secondary);
  }

  .stage-0 .content,
  .content.stage0 {
    background: var(--theme-color-blue-primary);
  }

  .stage-1 .content,
  .content.stage1 {
    background: var(--theme-color-pop-secondary);
  }

  .stage-2 .content,
  .content.stage2 {
    background: var(--theme-color-pop-primary);
  }

  .stage-3 .content,
  .content.stage3 {
    background: var(--theme-color-success-secondary);
  }

  .order-container {
    position: relative;

    line-height: 1.2;
    margin: 0 0 10px;
    user-select: none;
    border: 1px solid #d5d5d5;
    border-radius: 10px;
    background-color: hsl(240, 8%, 93%);
    color: #333;

    display: flex;
    overflow: visible;
    min-height: 60px;
  }

  .order-container button {
    background: var(--theme-background-primary);
    color: var(--theme-color-primary);
    border: none;
    outline: none;
    font-size: 14px;
    height: 60px;
    width: 50px;
  }

  .order-container button.open {
    position: absolute;
  }

  .order-container button.stroke {
    text-decoration: line-through;
  }

  .order-container button:disabled {
    cursor: forbidden;
  }

  .prev {
    box-shadow: -5px 0 2px -5px inset #000;
    border-radius: 10px 0 0 10px;
  }
  .next {
    box-shadow: 5px 0 2px -5px inset #000;
    border-radius: 0 10px 10px 0;
  }

  .order-container button:hover {
    background: var(--theme-background-grey-third);
    /* box-shadow: unset; */
    /* background: #666;
    color: #fff; */
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    top: 0;
    height: fit-content;
    width: 100%;
  }

  .content.open {
    position: absolute;
    z-index: 3;
    box-shadow: 0 0 16px 3px #fff;
    border-radius: 10px 10px 2px 2px;
  }

  .label {
    font-size: 16px;
  }

  .due {
    font-size: 12px;
    font-style: italic;
  }

  .info {
    text-align: center;
    grid-column: 1/-1;
    font-size: var(--theme-title-fontSize-secondary);
  }
</style>
