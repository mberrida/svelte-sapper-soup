<script>
  import CornerBtn from './CornerBtn.svelte';
  import FloorBtn from './FloorBtn.svelte';

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
  export let height = 'var(--theme-stepNav-height)';
  export let flex = '1';
  export let width = flex === '1' ? 'auto' : '100%';

  let fontWeight = 'normal';

  let btnWidth =
    flex === '1'
      ? '100%'
      : primary
      ? 'var(--theme-btn-width)'
      : 'calc(var(--theme-btn-width) - 2px)';
</script>

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
    <div
      class="btn-container"
      class:primary
      style="width:{primary ? '100%' : width}; 
        height:{primary ? '100%' : height}; 
        margin:{primary ? 0 : margin};"
    >
      {#if link}
        <a
          class="action-btn"
          class:primary
          href="{href}"
          on:click="{onClick}"
          rel="prefetch"
          bind:this="{ref}"
          style="width:{btnWidth}; 
            color:{color || primary ? 'var(--theme-color-pop-primary)' : 'var(--theme-color-primary)'};"
        >
          <slot />
        </a>
      {:else}
        <button
          class="action-btn"
          class:primary
          class:disabled
          on:click="{onClick}"
          type="{type}"
          bind:this="{ref}"
          style="outline:{outline};
          color:{color || primary ? 'var(--theme-color-pop-primary)' : 'var(--theme-color-primary)'};
          width:{btnWidth};"
        ><slot /></button>
      {/if}
    </div>
  </FloorBtn>
</CornerBtn>

<style>
  .btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--theme-btn-fontSize-primary);
    text-decoration: none;
    color: var(--theme-color-primary);
    cursor: pointer;
    outline: none;
    border: none;

    overflow: hidden;
    flex: 1;
    background: none;
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
    text-align: center;
    background: none;
  }

  .disabled,
  a:disabled,
  button:disabled {
    cursor: not-allowed;
    text-decoration: line-through;
  }
</style>
