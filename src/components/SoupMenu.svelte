<script>
  import { menuIndex, stage, viewport, detailsOpen } from '../store';
  import { onMount, onDestroy } from 'svelte';
  import Scroller from '@sveltejs/svelte-scroller';

  import SvelteTooltip from 'svelte-tooltip';
  import soupsLib from '../constants/soups-lib';
  import * as animateScroll from 'svelte-scrollto';
  import Soup from './Soup.svelte';

  import { onScrollHit } from '../utils/helpers';

  let count;
  export let index;
  let prevIndex = 0;
  let offset = 0;
  let progress;
  let top = 0;
  let bottom = 1;
  let threshold = 0.55;
</script>

<Scroller
  top="{top}"
  bottom="{bottom}"
  threshold="{threshold}"
  bind:index
  bind:offset
  bind:progress
  bind:count
>
  <div slot="background">
    <!-- Fixed bg-content -->
    <!-- <div class="scroll-data" style="position:fixed;z-index:5;background:#fff;">
      <p>current section: <strong>{index + 1}/{count}</strong></p>
      <progress value="{count ? (index + 1) / count : 0}"></progress>

      <p>offset in current section</p>
      <progress value="{offset || 0}"></progress>

      <p>total progress</p>
      <progress value="{progress || 0}"></progress>
    </div> -->
  </div>

  <div slot="foreground" class="grid-container">
    {#each soupsLib as soup, nth}
      <section
        class="soup-container soup-index-{nth}"
        before="{nth === index - 1}"
        after="{nth === index + 1}"
        previous="{nth === prevIndex}"
        active="{nth === index}"
        style="--soup-container-height:{$viewport.width < 500 ? $viewport.width : 500};"
      >
        <Soup
          soup="{soup}"
          indexInView="{index}"
          listIndex="{nth}"
          soupOffset="{offset}"
        />
      </section>
    {/each}
  </div>
</Scroller>

<style>
  section {
    height: 80vh;
  }
  .home-link {
    width: 20vw;
    height: 20vw;
    border: var(--theme-color-primary) solid 1px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    font-size: var(--theme-title-fontSize-secondary);
    margin: 0 auto 20px;
  }
  .title {
    text-align: center;
    font-size: var(--theme-title-fontSize-primary);
  }
  .grid-container {
    width: 100%;
    max-width: 1000px;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  .soup-container {
    margin: 0;
    width: calc(1px * var(--soup-container-height));
    height: calc(1px * var(--soup-container-height));
    position: relative;
    transition: 300ms;
    color: white;
    padding: 0;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    overflow: hidden;
  }

  [slot='foreground'] {
    pointer-events: none;
    box-shadow: 0px -19px 7px -23px black;
  }

  [slot='foreground'] section {
    pointer-events: all;
  }

  .soup-header {
    padding: 1em;

    background: #fff;
    color: #000;

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
    margin: 0;
  }

  .soup-description {
    font-style: italic;
  }

  .header-right {
    max-width: 30%;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .soup-tag {
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

  .tag-tooltip-content {
    background: white;
    padding: 0 5px;
    border: 1px solid black;
    border-radius: 4px;
    transform: translateX(-50px);
  }

  .soup-footer {
    display: flex;
    justify-content: space-evenly;
    padding: 0;
    height: 100px;
    max-height: 20%;
  }

  .action-btn-container {
    position: relative;
    flex: 1;

    margin: 0;

    height: 100%;
    color: #000;
    font-weight: 700;

    background: #fff;
    display: flex;
    justify-content: center;
  }

  .action-btn {
    width: 70%;
    height: 70%;
    margin: auto;
    font-size: 1.4em;
    font-weight: 700;
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
  }

  .action-btn.add {
    border: 2px solid #000;
    transition: all 100ms;
  }

  .action-btn.add:hover {
    border-width: 5px;
    transition: all 100ms;
  }

  .action-btn-overlay {
    position: absolute;
    width: 10%;
    height: 20%;
    border: #000 solid 0px;
    transition: all 100ms;
  }

  .action-btn-overlay.top-right {
    top: 15%;
    right: 15%;
    border-top-width: 2px;
    border-right-width: 2px;
  }

  .action-btn-overlay.bottom-left {
    bottom: 15%;
    left: 15%;
    border-bottom-width: 2px;
    border-left-width: 2px;
  }

  .action-btn:hover ~ .action-btn-overlay.top-right {
    border-top-width: 5px;
    border-right-width: 5px;
  }
  .action-btn:hover ~ .action-btn-overlay.bottom-left {
    border-bottom-width: 5px;
    border-left-width: 5px;
  }

  .soup-img {
    position: absolute;
    z-index: -1;
    width: calc((1px * var(--soup-container-height) + 50px));
    height: calc((1px * var(--soup-container-height) + 50px));
    left: -25px;
    top: -50px;
    transform: translateY(calc(1px * var(--translate-y)));
    filter: grayscale(var(--grayscale));
  }

  /*  .scroll-data {
        position: fixed;
        z-index: 9999;
        top: 200px;
        right: 0;
    } */
</style>
