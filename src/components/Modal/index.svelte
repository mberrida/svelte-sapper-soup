<script>
  import { fly, fade } from 'svelte/transition';
  import { modal, viewport, enter, exit, headerHeight } from '../../store';
  export let onCancel = () => {};
  export let onOkay = () => {};
  export let className = '';
  export let sticky = false;
  export let overlay = true;
  export let bg = 'var(--theme-background-primary)';
  export let padding = '20px 10px';
  export let position;
  export let margin = 'auto';
  export let col;

  let value;
  let onChange = () => {};

  function _onCancel(next = null) {
    onCancel();
    close();
  }

  export let close = (next = null) => {
    modal.set(next);
  };

  function _onOkay() {
    onOkay(value);
    close();
  }

  $: onChange(value);

  export let width;
  $: width = $viewport.width > 500 ? 500 : $viewport.width - 40;
</script>

{#if overlay}
  <div
    class="overlay"
    on:click="{_onCancel}"
    transition:fade="{{ duration: 200 }}"
    style="background:'rgba(0, 0, 0, 0.5)';"
  >
    <div
      class="container"
      in:fly="{$enter()}"
      out:fly="{$exit()}"
      style="align-items:{sticky ? 'flex-start' : 'center'};"
    >
      <div
        on:click|stopPropagation
        class="modal {className}"
        style="width:{width}px; 
        position:{position ? position : sticky ? 'absolute' : 'relative'};
        top:{sticky ? '0' : 'unset'}; 
        padding:{padding}; 
        margin:{margin};
        background:{bg};"
      >
        <slot />
      </div>
    </div>
  </div>
{:else}
  <div
    on:click|stopPropagation
    class="modal {className}"
    style="width:100%; 
    position:{position ? position : sticky ? 'fixed' : 'relative'}; 
    z-index:{overlay ? '0' : '3'}; 
    top:{sticky ? '0' : 'unset'}; 
    background:{bg}; 
    padding:{padding};
    margin:{margin};
    grid-column:{col};"
  >
    <slot />
  </div>
{/if}

<style>
  .overlay {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 5;
  }
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 6;
    background: none;
  }
  .modal {
    margin: auto;
    display: flex;
    flex-direction: column;
    background: none;
    border-radius: 5px;
    padding: 20px 10px;
    height: fit-content;
  }

  .options {
    display: grid;
    grid-template-columns: 1fr 65%;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
  }

  .confirm {
    grid-column: 2;
    flex: 1;
  }

  .close {
    position: absolute;
    top: -2rem;
    right: 0;
    background: black;
  }
</style>
