<script context="module">
  export async function preload({ params }, session) {
    const res = await this.fetch(`fetch/get~soups~${params.id}`);

    if (res.error)
      return console.error('erreur lors de la récupération des détails de la soupe', res.error);

    const soup = await res.json();

    return { soup };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import {
    currentSoup,
    viewport,
    stageDirection,
    enter,
    streetMap,
    soupPrototype,
  } from '../store';
  import { timeStamp } from '../utils/helpers';
  import { soupTemplate } from '../constants/preset';
  import { geoSearch } from '../utils/dynamicImport';
  import StepNav from '../components/StepNav.svelte';
  import StepNavBtn from '../components/StepNavBtn.svelte';
  import StepNavSpace from '../components/StepNavSpace.svelte';

  export let soup;

  if (!$soupPrototype) soupPrototype.set({ ...soup });

  let mounted = false;
  onMount(async () => {
    mounted = true;
    if (!$streetMap)
      streetMap.set(new (await geoSearch()).OpenStreetMapProvider());
  });

  const addSoup = () => {
    stageDirection.set('right');
    currentSoup.set(soupTemplate(soup));
  };
</script>

<svelte:head>
  <title>Soupe Svelte Sapper! À propos de la soupe</title>
</svelte:head>

{#if mounted && soup}
  <div class="container detaljer" style="width:100%" in:fly="{$enter()}">
    <div class="header" style="width:{$viewport.width - 10}px;">
      <div class="header-row">
        <h1 class="title">{soup.name}</h1>
        <p class="price">{soup.price}€</p>
      </div>
      <h2>{soup.description}</h2>
    </div>

    <div class="content" style="width:{$viewport.width - 10}px;">
      <h3 class="section-header">Contenu</h3>
      {#each soup.content as content}
        <p class="content-line">{content}</p>
      {/each}

      <h3 class="section-header">Nutrition</h3>
      {#each soup.nutrition as n (n.name)}
        <p class="content-line">{n.name} {n.value}{n.unit}</p>
        {#if n.children}
          {#each n.children as child (child.name)}
            <p class="content-line child">
              dont
              {child.name}
              {child.value}{child.unit}
            </p>
          {/each}
        {/if}
      {/each}

      <StepNavSpace />
    </div>

    <StepNav>
      <StepNavBtn
        href="/"
        primary="{false}"
        onClick="{() => {
          stageDirection.set('right');
          currentSoup.set(null);
        }}"
      >
      Retour
      </StepNavBtn>

      <StepNavBtn href="ny-soppa~{soup.id}~minus" onClick="{addSoup}">
        Ajouter
      </StepNavBtn>
    </StepNav>

    <div class="img-container">
      <img src="{soup.img}" alt="image of {soup.id}" />
    </div>
  </div>
{:else}
  <h2>Impossible de trouver la soupe :(</h2>
{/if}

<style>
  .detaljer.container {
    width: 100%;
    max-width: var(--theme-maxWidth);
    height: 100%;
    /* height: fit-content; */
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .detaljer.container > *:not(.img-container) {
    max-width: calc(var(--theme-maxWidth) - 10px);
  }
  .header,
  .content {
    position: relative;
    padding: 5px;
  }

  .content {
    flex: 1;
  }

  .header {
    display: flex;
    flex-direction: column;
  }
  .header-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-self: center;
  }

  .title {
    margin: auto 0;
    text-align: left;
  }

  .price {
    font-size: var(--theme-title-fontSize-secondary);
  }

  .section-header {
    margin-top: 20px;
  }

  .content-line {
    font-weight: 700;
    font-style: italic;
    margin: 0;
  }

  .content-line.child {
    font-weight: normal;
    text-indent: 20px;
  }

  .img-container {
    position: absolute;
    /* left: 0; */
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  img {
    height: 100vh;
    width: auto;
    z-index: -1;
    opacity: 0.2;
  }

  @media all and (orientation: landscape) {
    img {
      max-width: var(--theme-maxWidth);
    }
  }
</style>
