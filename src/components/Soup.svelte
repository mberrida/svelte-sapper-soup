<script>
  import {
    soupPrototype,
    stage,
    viewport,
    currentSoup,
    menuIndex,
    stageDirection,
  } from '../store';
  import Popover from 'svelte-popover';
  import Emoji from 'svelte-emoji';
  import { emojiSymbol, timeStamp } from '../utils/helpers';
  import { soupTemplate } from '../constants/preset';
  import SvelteTooltip from 'svelte-tooltip';
  import { goto } from '@sapper/app';
  import * as animateScroll from 'svelte-scrollto';
  import CornerBtn from '../components/CornerBtn.svelte';
  import FloorBtn from '../components/FloorBtn.svelte';

  export let soup;
  export let indexInView;
  export let soupOffset;
  export let listIndex;

  let actionW = $viewport.width < 480 ? '99%' : '70%';
  let actionH = $viewport.width < 480 ? '99%' : '70%';

  // sync num of list-columns for parallax
  let listCols = 1;

  const setY = ({ listIndex, activeIndex }) => {
    let res =
      (widePort && listIndex + 1 === activeIndex) || listIndex === activeIndex
        ? -soupOffset * 50
        : listIndex < activeIndex
        ? -50
        : 0;

    if (res === -Infinity || res === Infinity) res = 0;

    return res;
  };
  const setGrey = ({ listIndex, activeIndex }) =>
    ((widePort && listIndex + 1 < activeIndex) ||
      (!widePort && listIndex + 1 === activeIndex)) &&
    scrollY > 200
      ? soupOffset + 0.4
      : 0;

  let widePort = false;
  let soupContainerHeight = 500;
  let parallaxY = 0;
  let parallaxGrey = 0;

  $: widePort =
    $viewport.width > 999 && !widePort
      ? true
      : $viewport.width <= 999 && widePort
      ? false
      : widePort;

  $: soupContainerHeight = $viewport.width < 500 ? $viewport.width : 500;

  $: if (soupOffset) {
    parallaxY = setY({ listIndex, activeIndex: indexInView });
    parallaxGrey = setGrey({ listIndex, activeIndex: indexInView });
  }

  const detailsSetup = (proto) => {
    stageDirection.set('left');
    menuIndex.set(indexInView);
    //console.log('NEW MENU INDEX', $menuIndex, indexInView);
    soupPrototype.set({ ...proto });
    goto(`detaljer~${soup.id}`);
  };

  const addSoup = (proto) => {
    stageDirection.set('right');
    menuIndex.set(indexInView);
    currentSoup.set(soupTemplate(proto));

    soupPrototype.set({ ...proto });
    stage.set('SoupRemove');
  };
</script>

<div class="soup-header">
  <div class="header-top">
    <h3 class="soup-name">{soup.name}</h3>
    <p class="price">{soup.price}kr</p>
  </div>
  <div class="header-bottom">
    <div class="header-left">
      <p class="soup-content">{soup.content.join(', ')}</p>
    </div>
    <div class="header-right">
      {#each soup.tags as tag}
        <div class="soup-tag">
          <div class="tooltip-target">
            <Emoji symbol="{emojiSymbol(tag)}" label="{tag}" />
          </div>
          <div class="tooltip-content">{tag}</div>
        </div>
      {/each}
    </div>
  </div>
</div>

<div class="soup-footer">
  <FloorBtn width="50%" bg="#fff">
    <button class="action-btn info" on:click="{() => detailsSetup(soup)}">info
    </button>
  </FloorBtn>

  <CornerBtn bg="#fff" width="50%">
    <a
      class="action-btn add"
      href="ny-soppa~{soup.id}~minus"
      rel="prefetch"
      on:click="{() => addSoup(soup)}"
    >lägg till</a>
  </CornerBtn>
</div>

<img
  class="soup-img"
  src="{soup.img}"
  alt="{`image of ${soup.name} soup`}"
  style="--translate-y:{parallaxY}; 
  --grayscale:{parallaxGrey}; 
  position:absolute;
    top:0;
    zIndex: -1;"
/>

<style>
  .soup-img {
    position: absolute;
    z-index: -1;
    width: calc((1px * var(--soup-container-height) + 50px));
    height: calc((1px * var(--soup-container-height) + 50px));
    left: -25px;
    top: -50px;
    transform: translateY(calc(1px * var(--translate-y)));
    filter: grayscale(var(--grayscale));
    transition: all 500ms;
  }
  .soup-header {
    padding: 1em;

    color: #000;
    background: #fff;
    display: flex;
    flex-direction: column;
    box-shadow: 0 5px 10px -9px #000;
  }

  .header-top,
  .header-bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-left {
    position: relative;
    max-width: 70%;
  }

  .soup-name {
    font-size: 2em;
    z-index: 1;
    margin: auto 0;
  }

  .price {
    font-size: var(--theme-title-fontSize-secondary);
  }

  .header-right {
    max-width: 30%;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    position: absolute;
    right: 0;
  }

  .soup-tag {
    position: relative;
    font-size: 0.6em;
    font-style: italic;
    margin: 2px;
    padding: 2px 5px;
    background: #fff;
    border: #eee solid 1px;
    border-radius: 3px;
    color: #444;
    border-radius: 5px;
    cursor: help;
  }

  .tooltip-content {
    background: #fff;
    border: var(--theme-border-primary);
    color: var(--theme-color-primary);
    font-size: 20px;
    font-weight: 700;
    font-style: normal;
    padding: 0 8px;
    border-radius: 4px;
    transform: translateX(-50px);
    opacity: 0;
    position: absolute;
    z-index: 3;
    left: -100vw;
    bottom: -100vh;
    transition: 400;
  }

  .soup-tag:hover .tooltip-content {
    left: -40px;
    bottom: -40px;
    opacity: 1;
  }

  .soup-footer {
    display: flex;
    justify-content: space-evenly;
    padding: 0;
    height: 100px;
    max-height: 20%;
    box-shadow: 0 -5px 10px -9px #000;
  }

  .action-btn {
    width: 70%;
    height: 70%;
    margin: auto;
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 2;
    text-decoration: none;
    color: var(--theme-color-primary);
  }

  .action-btn:hover {
    transition: all 100ms;
  }

  .action-btn.info:hover {
    border-width: 5px;
  }

  .action-btn.add:hover {
    border-width: 5px;
    transition: all 100ms;
  }
</style>
