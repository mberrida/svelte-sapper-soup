<script>
  import iconsLib from '../constants/icons-lib';

  export let icon = null;
  export let alt = 'icon';
  export let label = false;
  export let labelPos = 'bottom';
  export let labelMargin = 'auto';
  export let size = 50;
  export let color = 'var(--theme-color-primary)';
  export let labelColor = 'var(--theme-color-primary)';
  export let position = 'relative';
  export let transform = null;
  export let iconTop = '0';
  export let width = '100%';
  export let margin = 'auto';
  export let className = '';
  export let onClick = () => {
    return false;
  };

  $: w = Array.isArray(size) ? size[0] : size;
  $: h = Array.isArray(size) ? size[1] : size;
</script>

<div
  class="icon-container outer {className}"
  style="position:{position}; width:{width}; cursor:{!onClick() ? 'normal' : 'pointer'}"
  on:click="{onClick}"
>
  {#if label && labelPos === 'top'}
    <p class="label top" style="color:{labelColor}; margin:{labelMargin};">
      {label}
    </p>
  {/if}

  <div
    class="icon-container inner"
    style="transform:{transform}; 
      width:{w}px; 
      height:{h}px; 
      max-height:unset; 
      max-width:unset; 
      color:{color}; 
      top:{iconTop};
      margin:{margin};"
  >
    {#if iconsLib[icon]}
      <svelte:component this="{iconsLib[icon]}" />
    {:else if icon && typeof icon === 'string'}
      <img
        src="{icon}"
        alt="{alt || label}"
        style="width:{w}px; 
      height:{h}px; "
      />
    {/if}
  </div>

  {#if label && labelPos === 'bottom'}
    <p class="label bottom" style="color:{labelColor}; margin:{labelMargin};">
      {label}
    </p>
  {/if}
</div>

<style>
  .icon-container.outer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .icon-container.outer > * {
    width: 100%;
  }

  .icon-container.inner {
    display: flex;
    justify-content: center;
    position: relative;
  }

  .label {
    margin: 0;
    text-align: center;
    font-size: 0.7em;
    font-weight: inherit;
    font-style: inherit;
    text-decoration: inherit;
  }

  .label.top {
    margin-bottom: 0px;
  }
  .label.bottom {
    margin-top: 0px;
  }
</style>
