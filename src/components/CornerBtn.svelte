<script>
  import { viewport } from '../store';
  export let color = '#444';
  export let width = '100%';
  export let height = '100%';
  export let flex = '1';
  export let margin = 0;
  export let bg = 'var(--theme-background-primary)';
  export let display = 'flex';
  export let justify = 'center';
  export let bypass = false;
  export let className = '';

  let btnW;

  let cornerW = 0,
    cornerH = 0,
    cornerMargin = 0,
    cornerDistance = 0;

  $: {
    cornerW = btnW < 230 ? 30 : 50;
    cornerH = btnW < 230 ? 15 : 25;
    cornerMargin = btnW * 0.15;
    cornerDistance = btnW - cornerMargin * 2 - cornerW + 'px';
  }
</script>

{#if bypass}
  <slot />
{:else}
  <div
    class="action-btn-container info"
    class:className
    style="
        width:{width};
        height:{height};
        margin:{margin};
        background:{bg};
        display:{display};
        justify-content:{justify};
        flex:{flex};
        --cornerDistance:{cornerDistance};"
    bind:clientWidth="{btnW}"
  >
    <slot />

    <div
      class="action-btn-overlay top-right"
      style="border-color:{color}; 
        width:{cornerW}px; 
        height:{cornerH}px;
        "
    ></div>
    <div
      class="action-btn-overlay bottom-left"
      style="border-color:{color};
        width:{cornerW}px; 
        height:{cornerH}px;
        "
    ></div>
  </div>
{/if}

<style>
  .action-btn-container {
    position: relative;
    margin: 0;
    height: 100%;
    color: #000;
    background: #fff;
    display: flex;
    justify-content: center;
  }

  .action-btn-overlay {
    position: absolute;

    border: #000 solid 0px;
    transition: all 100ms;
  }

  .action-btn-overlay.top-right {
    border-top-width: 2px;
    border-right-width: 2px;
    top: 15%;
    right: 15%;
  }

  .action-btn-overlay.bottom-left {
    border-bottom-width: 2px;
    border-left-width: 2px;
    bottom: 15%;
    left: 15%;
  }

  .action-btn-container:hover > .action-btn-overlay.top-right {
    border-top-width: 5px;
    border-right-width: 0;
    border-left-width: 5px;
    transform: translateX(calc(0px - var(--cornerDistance)));
  }
  .action-btn-container:hover > .action-btn-overlay.bottom-left {
    border-bottom-width: 5px;
    border-left-width: 0;
    border-right-width: 5px;
    transform: translateX(var(--cornerDistance));
  }
</style>
