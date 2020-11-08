<script>
  import CornerBtn from '../components/CornerBtn.svelte';
  import FloorBtn from '../components/FloorBtn.svelte';
  import Icon from '../components/Icon.svelte';

  import { fly, fade } from 'svelte/transition';
  import { expoInOut } from 'svelte/easing';
  import { delayTransitionIn, delayTransitionOut } from '../utils/helpers';

  export let icon = null;
  export let iconPlacement = 'left';
  export let iconAlt = null;
  export let index = 0;
  export let count = 1;
  export let interval = 250;
  export let duration = 400;
  export let primary = true;
  export let color = null;
  export let onClick = null;
  export let link = true;
  export let href = '';
  export let disabled = false;
  export let type = 'button';
  export let ref = null;
  export let outline = 'none';
  export let margin = '0 auto';
  export let height = 'var(--theme-btn-height)';
  export let flex = 'unset';
  export let width = flex === '1' ? 'auto' : '100%';
  export let border =
    'none'; /* primary ? 'none' : 'var(--theme-border-primary)'; */
  export let _in = null;
  export let _out = null;

  let enter =
    _in ||
    delayTransitionIn({
      index,
      count,
      interval,
      duration,
      delayAll: 300,
    });
  let exit =
    _out || delayTransitionOut({ index, count, interval: 100, duration: 150 });
</script>

<div class="action-btn" in:fly="{enter}" out:fly="{exit}">
  <CornerBtn
    bypass="{!primary}"
    className="{primary}"
    flex="1"
    width="{width}"
    height="{height}"
    margin="{margin}"
  >
    <FloorBtn
      bypass="{primary}"
      className="{primary}"
      flex="1"
      width="{width}"
      height="{height}"
      margin="{margin}"
    >
      {#if icon && iconPlacement === 'left'}
        <div class="icon-container" style="left:20px;">
          <img class="icon" src="{icon}" alt="{iconAlt || 'button icon'}" />
        </div>
      {/if}
      <div
        class="btn-container"
        style="width:{width}; height:{height}; flex:{flex}; margin:{margin}; border:{border};"
      >
        {#if link}
          <a
            class:primary
            href="{href}"
            on:click="{onClick}"
            rel="prefetch"
            bind:this="{ref}"
            style="color:{color || primary ? 'var(--theme-color-pop-primary)' : 'var(--theme-color-primary)'};"
          >
            <slot />
          </a>
        {:else}
          <button
            class:primary
            class:disabled
            on:click="{onClick}"
            type="{type}"
            bind:this="{ref}"
            style="outline:{outline}; color:{color || primary ? 'var(--theme-color-pop-primary)' : 'var(--theme-color-primary)'};"
          ><slot /></button>
        {/if}
      </div>
      {#if icon && iconPlacement === 'right'}
        <div class="icon-container" style="right:20px;">
          <img class="icon" src="{icon}" alt="{iconAlt || 'button icon'}" />
        </div>
      {/if}
    </FloorBtn>
  </CornerBtn>
</div>

<style>
  .action-btn {
    width: 100%;
    max-width: 400px;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    position: relative;
  }
  .btn-container {
    width: 100%;
    max-width: 400px;
    height: var(--theme-btn-height);
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: var(--theme-borderRadius);
  }
  button,
  a {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 0 auto;

    font-size: var(--theme-btn-fontSize-primary);
    border: none;

    cursor: pointer;
  }

  .primary {
    border: none;
  }

  .primary:hover {
    font-size: var(--theme-btn-fontSize-xl);
  }

  .disabled,
  a:disabled,
  button:disabled {
    cursor: not-allowed;
    text-decoration: line-through;
  }
  .icon-container {
    position: absolute;
    align-self: center;
  }
  .icon {
    width: 20px;
    height: 20px;
  }
</style>
