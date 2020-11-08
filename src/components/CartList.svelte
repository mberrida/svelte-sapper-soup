<script>
  import { goto } from '@sapper/app';
  import { flip } from 'svelte/animate';
  import { fly, slide } from 'svelte/transition';

  import { expoOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import Popover from 'svelte-popover';
  import {
    currentSoup,
    soupPrototype,
    editMode,
    stage,
    stageDirection,
    viewport,
    cartSoups,
    cartSides,
    cartDrinks,
    cartMeta,
  } from '../store';
  import { clone } from '../utils/helpers';
  import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte';
  import FaRegEdit from 'svelte-icons/fa/FaRegEdit.svelte';
  import FaMinus from 'svelte-icons/fa/FaMinus.svelte';
  import FaRegPlusSquare from 'svelte-icons/fa/FaRegPlusSquare.svelte';
  import FaRegMinusSquare from 'svelte-icons/fa/FaRegMinusSquare.svelte';

  import IncDec from './IncDec.svelte';
  import Icon from './Icon.svelte';

  export let editable = false;
  export let orderStatus = 0;
  export let total = true;
  export let width = $viewport.width - 10 + 'px';
  export let altColor = 'var(--theme-color-primary)';

  let detailsOpen = editable ? false : true;

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 400),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 800,
        easing: expoOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
      };
    },
  });

  const editSoup = (id, proto) => {
    const match = $cartSoups.find((s) => s.id === id);

    if (match) {
      currentSoup.set(match);
      soupPrototype.set({ ...proto });
      editMode.set(true);
      goto(`ny-soppa~${proto.id}~minus`);
    } else {
      // just in case
      editMode.set(false);
      currentSoup.set(null);
      console.log('Soup to edit not found.');
    }
  };
</script>

<div class="board" style="width:{width}; --alt-color:{altColor};">
  {#if $cartMeta.count.soups > 0}
    <div class="list-section" transition:fly="{{ y: -50 }}">
      <h3 class="section-title">Soppor</h3>
      {#each $cartSoups as { id, addons, removed, proto, price, served, ...soup } (id)}
        <div
          class="card-row soups"
          out:send="{{ key: id }}"
          animate:flip="{{ duration: 400 }}"
          on:click="{() => {
            if (editable) {
              detailsOpen = detailsOpen === id ? false : id;
            }
          }}"
          style="grid-template-columns:1fr {editable ? `${$viewport.width <= 480 ? '90' : '100'}px` : ''};"
        >
          <div class="card" style="cursor:{editable ? 'pointer' : 'normal'};">
            <div class="row">
              <div class="content">
                <h3 class="item-title">
                  {proto.name}
                  {#if addons.length + removed.length > 0}
                    <span class="item-note">(special)</span>
                  {/if}
                  {price}kr
                </h3>
                {#if served === 'cold' && detailsOpen !== id && detailsOpen !== true}
                  <p class="item-note">
                    {orderStatus < 3 ? 'Serveras' : 'Serverades'}
                    kall
                  </p>
                {/if}
                {#if (detailsOpen !== id || detailsOpen === true) && editable}
                  <p class="item-note">
                    {#if removed.length > 0}utan {removed[0].name}...{/if}
                    {#if addons.length > 0}med {addons[0].name}...{/if}
                  </p>
                {/if}

                {#if detailsOpen === id || !editable}
                  <div
                    class="details"
                    transition:slide="{{ duration: 500, easing: expoOut }}"
                  >
                    <p>
                      {orderStatus < 3 ? 'Serveras' : 'Serverades'}
                      {served === 'hot' ? 'varm' : 'kall'}
                    </p>

                    {#if removed.length > 0}
                      <div>
                        <p class="label">borttaget</p>{#each removed as r}
                          <p>{r.name}</p>
                        {/each}
                      </div>
                    {/if}
                    {#if addons.length > 0}
                      <div>
                        <p class="label">extra</p>{#each addons as a}
                          <p>
                            {a.amount}{a.unit}
                            {a.name}: +{a.price * a.amount}{a.currency}
                          </p>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
            {#if editable}
              <div
                class="collapse"
                style="position:{$viewport.width <= 520 ? 'relative' : 'absolute'};"
              >
                <Icon
                  icon="angleDown"
                  transform="rotate({detailsOpen === id ? '180' : '0'}deg)"
                  size="{30}"
                />
              </div>
            {/if}
          </div>

          {#if editable}
            <div class="options soup">
              <button
                class="action edit"
                on:click="{() => {
                  editSoup(id, proto);
                }}"
              ><FaRegEdit /></button>

              <button
                class="action remove"
                on:click="{() => {
                  cartSoups.set($cartSoups.filter((s) => s.id !== id));
                }}"
              ><FaRegTrashAlt /></button>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  {#if $cartMeta.count.sides > 0}
    <div class="list-section" transition:fly="{{ y: -50 }}">
      <h3 class="section-title">Tillbehör</h3>
      {#each $cartSides.filter((s) => s.amount > 0) as { id, name, amount, unit, price, currency } (id)}
        <div
          class="card-row sides"
          out:send="{{ key: id }}"
          animate:flip="{{ duration: 400 }}"
          style="grid-template-columns:1fr {editable ? `20px ${$viewport.width <= 480 ? '90' : '100'}px` : ''};"
        >
          <div class="card">
            <div class="row">
              <div class="content">
                <h3 class="item-title">{name}</h3>
                <p class="item-note">
                  <span>{amount}</span>
                  {unit}
                  =
                  <span>{price * amount}</span>
                  {currency}
                </p>
              </div>
            </div>
          </div>

          <p class="amount">{amount}st</p>

          {#if editable}
            <div class="options sides">
              <IncDec
                bind:value="{$cartSides[$cartSides.findIndex((s) => s.id === id)].amount}"
                onDec="{() => {
                  if (amount > 0) $cartSides[$cartSides.findIndex((s) => s.id === id)].amount--;
                }}"
                onInc="{() => {
                  $cartSides[$cartSides.findIndex((s) => s.id === id)].amount++;
                }}"
              />
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
  {#if $cartMeta.count.drinks > 0}
    <div class="list-section" transition:fly="{{ y: -50 }}">
      <h3 class="section-title">Dryck</h3>
      {#each $cartDrinks.filter((d) => d.amount > 0) as { id, name, amount, unit, price, currency } (id)}
        <div
          class="card-row drinks"
          out:send="{{ key: id }}"
          animate:flip="{{ duration: 400 }}"
          style="grid-template-columns:1fr {editable ? `20px ${$viewport.width <= 480 ? '90' : '100'}px` : ''};"
        >
          <div class="card">
            <div class="row">
              <div class="content">
                <h3 class="item-title">{name}</h3>
                <p class="item-note">
                  <span>{amount}</span>
                  {unit}
                  =
                  <span>{price * amount}</span>
                  {currency}
                </p>
              </div>
            </div>
          </div>

          <p class="amount">{amount}st</p>

          {#if editable}
            <div class="options drinks">
              <IncDec
                bind:value="{$cartDrinks[$cartDrinks.findIndex((d) => d.id === id)].amount}"
                onDec="{() => {
                  if (amount > 0) $cartDrinks[$cartDrinks.findIndex((d) => d.id === id)].amount--;
                }}"
                onInc="{() => {
                  $cartDrinks[$cartDrinks.findIndex((d) => d.id === id)].amount++;
                }}"
              />
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
  {#if total}
    <p class="total">Totalt: {$cartMeta.price.total}kr</p>
  {/if}

  <!-- <div class="bottom-space"></div> -->
</div>

<style>
  .list-section > h3,
  .total {
    color: var(--alt-color);
  }
  .board,
  .list-section {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }

  .list-section {
    margin-bottom: 29px;
  }

  .card-row {
    display: grid;

    grid-gap: 1em;
    width: 100%;
    margin: 0 auto;
  }

  .row {
    width: 100%;
    display: flex;
  }

  .card {
    grid-column: 1;
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    margin: 5px 0;
    padding: 5px;
    border-radius: 2px;
    border: 1px solid hsl(240, 8%, 70%);
    background-color: hsl(240, 8%, 93%);
    color: #333;
    position: relative;
  }

  .collapse {
    position: absolute;
    top: 5px;
    right: 5px;
  }

  .amount {
    grid-column: 2;
    margin: auto;
  }

  .content {
    flex: 1;
  }

  .section-title {
    font-size: var(--theme-title-fontSize-secondary);
  }

  .details {
    display: flex;
    flex-direction: column;
  }
  .details p {
    font-size: 12px;
  }

  .details .label {
    font-weight: 700;
  }

  .options {
    grid-column: 3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .options.soup {
    grid-column: 2;
  }

  .item-title {
    font-size: var(--theme-title-fontSize-third);
    margin: 0;
  }

  .item-note {
    font-size: 10px;
    font-style: italic;
    margin: 0;
  }

  .item-note > span {
    font-weight: 700;
    font-size: 14px;
  }

  button.action {
    width: 45px;
    height: auto;
    background-size: 1.4em 1.4em;
    border: none;
    opacity: 1;
    transition: opacity 0.2s;
    cursor: pointer;
    outline: none;
    padding: 10px;
  }

  button.action.remove {
    width: 42px;
    height: auto;
  }

  .total {
    text-align: center;
    text-decoration: underline;
    font-size: var(--theme-title-fontSize-primary);
  }

  @media all and (max-width: 480px) {
    .card-row {
      grid-template-columns: 1fr 20px 90px;
    }
  }
</style>
