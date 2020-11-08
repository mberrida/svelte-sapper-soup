<script>
  import { orderStages, statusStages } from '../constants/preset';
  import { slide } from 'svelte/transition';
  import Icon from '../components/Icon.svelte';
  import ProductList from './ProductList.svelte';
  export let orders;
  export let user;

  let bgFallback = 'var(--theme-background-primary)';
  export let bg = { primary: bgFallback, secondary: bgFallback };

  let orderOpen = false;
</script>

{#each orders as { items, address, created, updated, status, dueDate, paymentMethod, _id } (_id)}
  <div
    class="order-item"
    style="background:{orderOpen === _id ? bg.secondary : 'none'};"
  >
    <div class="content">
      <button
        class="toggle-panel"
        on:click="{() => {
          orderOpen = orderOpen === _id ? false : _id;
        }}"
        style="background:{orderOpen === _id ? bg.secondary : bg.primary};"
      >
        <div class="meta">
          <p class="label">Status</p>
          <p>{statusStages[status.stage]}</p>
          <p class="label">Beställningsdatum</p>
          <p>{created.date} {created.time}</p>
          <p class="label">
            {status.stage < 3 ? 'Planerad leverans' : 'Leveransdatum'}
          </p>
          <p>{dueDate.date} {dueDate.time}</p>
        </div>
        <Icon
          icon="angleDown"
          color="var(--theme-color-primary)"
          width="auto"
          transform="{orderOpen === _id ? 'rotate(180deg)' : 'rotate(0deg)'}"
        />
      </button>
      {#if orderOpen === _id}
        <div class="order-container" transition:slide>
          <div class="inner-meta">
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
          />
        </div>
      {/if}
    </div>
  </div>
{/each}

<style>
  .order-item {
    display: grid;
    grid-template-columns: 1fr 150px;
    grid-template-rows: repeat(1fr);
    /* height: 100%; */
    column-gap: 20px;
  }

  .content {
    grid-column: 1 / -1;
  }

  .content > * {
    margin: 2px;
  }

  .toggle-panel {
    width: 100%;
    margin: 0 auto;
    outline: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
    border-radius: 2px;
    padding: 5px;
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

  .inner-meta,
  .toggle-panel {
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
</style>
