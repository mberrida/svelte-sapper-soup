<script>
  import { stores } from '@sapper/app';
  import { orderStages, statusStages } from '../constants/preset';
  import { httpResMSg, tryCallback } from '../utils/helpers';
  import { slide } from 'svelte/transition';
  import Icon from '../components/Icon.svelte';
  import ProductList from './ProductList.svelte';

  import StepNavSpace from '../components/StepNavSpace.svelte';

  const { session } = stores();

  export let order;
  const {
    items,
    address,
    created,
    updated,
    status,
    dueDate,
    paymentMethod,
    user,
    _id,
  } = order;

  export let isOpen = false;

  export let deleteCb;

  let altColor =
    'var(--theme-color-' + (status.stage === 0 ? 'secondary' : 'primary') + ')';

  const deleteOrder = async () => {
    if (!$session.tokenExists)
      return console.log('no token found. Not authorized to delete order.');

    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'deleteOrder',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: $session.user.id,
        orderId: _id,
      }),
    });

    console.log(httpResMSg(fetched.status, 'radering av order'));

    tryCallback(deleteCb());
  };
</script>

<div class="container admin-order" style="--alt-color:{altColor};">
  <button class="toggle-panel">
    <div class="meta">
      <p class="label">{dueDate.date} {dueDate.time}</p>
      <p>{address.street}</p>
      <p>{user.firstName} {user.lastName}</p>
    </div>
    <Icon
      icon="angleDown"
      color="var(--theme-color-primary)"
      width="auto"
      transform="{isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}"
      size="{30}"
    />
  </button>
  {#if isOpen}
    <div class="order-container" transition:slide>
      <div class="delete-container" on:click="{deleteOrder}">
        <Icon icon="trash" size="{30}" />
      </div>

      <div class="inner-meta">
        <div>
          <p class="label">Status</p>
          <p>{statusStages[status.stage]}</p>
          <p class="label">Beställningsdatum</p>
          <p>{created.date} {created.time}</p>
          <p class="label">
            {status.stage < 3 ? 'Planerad leverans' : 'Leveransdatum'}
          </p>
          <p>{dueDate.date} {dueDate.time}</p>
        </div>
        <div class="customer">
          <p class="label">Beställare</p>
          <p>{user.firstName} {user.lastName}</p>
          <p>{user.email}</p>
          <p><span class="label">Kundnr</span> {user.id}</p>
        </div>
        <p>
          <span class="label">Betalningsmetod</span>
          {paymentMethod === 'card' ? 'kort' : 'ej angivet'}
        </p>
        <div class="address">
          <p class="label">Leveransadress</p>

          <p>{address.firstName} {address.lastName}</p>
          <p>{address.street}</p>
          <p>{address.zip} {address.city}</p>
          {#if address.notes}
            <p>
              <span class="label">instruktioner/portkod</span>
              "{address.notes}"
            </p>
          {/if}
        </div>
      </div>
      <ProductList
        soups="{items.soups}"
        sides="{items.sides}"
        drinks="{items.drinks}"
        meta="{items.meta}"
        width="auto"
        orderStatus="{status}"
        altColor="{altColor}"
      />
      <StepNavSpace />
    </div>
  {/if}
</div>

<style>
  .container.admin-order {
    width: 100%;
    height: 100%;
  }

  .toggle-panel {
    width: 100%;
    height: 60px;
    margin: 0 auto;
    outline: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
    border-radius: 2px;
    padding: 5px;
    background: none;
  }

  .meta > p,
  .inner-meta * {
    color: var(--alt-color);
  }

  .meta {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .meta > * {
    font-size: 12px;
    font-style: italic;
    margin: 0;
  }

  .meta > *.label {
    font-weight: 700;
  }

  /*  */

  .inner-meta,
  .address,
  .customer {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .address,
  .customer {
    margin: 1em 0;
  }

  .inner-meta {
    margin-bottom: 1em;
  }

  .inner-meta p {
    font-style: italic;
  }

  .inner-meta .label {
    font-weight: 700;
    font-style: normal;
  }

  .address > p,
  .customer > p {
    margin: 0;
  }

  .delete-container {
    cursor: pointer;
  }

  .delete-container:hover {
    transform: scale(1.1);
  }
</style>
