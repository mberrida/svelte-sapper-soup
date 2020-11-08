<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { stores } from '@sapper/app';

  import {
    stage,
    currentAddress,
    menuIndex,
    enter,
    exit,
    Lstored,
    cartSoups,
    cartDrinks,
    cartMeta,
    streetMap,
    headerHeight,
    viewport,
  } from '../store';
  import { geoSearch } from '../utils/dynamicImport';
  import SoupMenu from '../components/SoupMenu.svelte';
  import CartBtn from '../components/CartBtn.svelte';

  import soups from '../constants/soups-lib';
  import drinks from '../constants/drinks-lib';
  import { scrollTo } from 'svelte-scrollto';

  const { page } = stores();

  let mounted = false;

  let ghostItem = false;

  $: ghostItem = $cartSoups[$cartSoups.length - 1] ? true : false;

  const onGhostEnd = () => {
    ghostItem = false;
  };

  onMount(async () => {
    // set leaflet/streetmap instance
    if (!$Lstored) Lstored.set(L);
    if (!$streetMap)
      streetMap.set(new (await geoSearch()).OpenStreetMapProvider());

    // autoscroll to last viewed soup
    if ($menuIndex < 1) return;

    scrollTo({
      element: `.soup-index-${$menuIndex}`,
      duration: 0,
      offset: -200, // test on different devices
      onStart: (element, offset) => {},
    });

    mounted = true;
  });
  let soupIndex = 0;
</script>

<svelte:head>
  <title>Svelte Sapper Soup! Meny</title>
</svelte:head>

{#if $page.path === '/'}
  <div class="container soups" in:fly="{$enter()}" out:fly="{$exit()}">
    <div
      class="header-space"
      style="height:{$headerHeight + ($viewport.width < 620 || $viewport.scrollY > 100 ? 35 : 80)}px;"
    ></div>
    <SoupMenu bind:index="{soupIndex}" />
    <div class="footer-space"></div>
  </div>
{/if}

<style>
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: absolute;
  }

  .header-space,
  .footer-space {
    width: 100%;
  }

  .footer-space {
    height: var(--theme-footer-height);
  }
</style>
