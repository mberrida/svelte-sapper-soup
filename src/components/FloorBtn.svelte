<script>
  import { viewport } from '../store';
  export let color = 'var(--theme-background-secondary)';
  export let width = '100%';
  export let height = '100%';
  export let floorW = $viewport.width < 480 ? '99%' : '70%';
  export let flex = '1';
  export let margin = 0;
  export let fontWeight = '700';
  export let bg = 'var(--theme-background-primary)';
  export let display = 'flex';
  export let justify = 'center';
  export let bypass = false;
  export let className = '';
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
        fontWeight:{fontWeight};
        background:{bg};
        display:{display};
        justify-content:{justify};
        flex:{flex};"
  >
    <slot />

    <div class="floor-container">
      <div
        class="floor"
        style="background:{color}; 
      width:{floorW};"
      ></div>
    </div>
  </div>
{/if}

<style>
  .action-btn-container {
    position: relative;
    width: 50%;

    margin: 0;

    height: 100%;
    color: #000;

    background: var(--theme-background-primary);
    display: flex;
    justify-content: center;
  }

  .floor-container {
    width: 100%;
    position: absolute;
    bottom: 15%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .floor {
    height: 2px;
    min-width: unset;
    max-width: 60px;
  }

  .action-btn-container:hover > .floor-container > .floor {
    height: 5px;
    transition: all 100ms;
  }
</style>
