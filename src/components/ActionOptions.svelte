<script>
  export let width = '100%';
  export let height = 'auto';
  export let flex = 'unset';
  export let position = 'absolute';
</script>

<div
  class="action-options"
  style="width:{width}; height:{height}; flex:{flex}; position:{position};"
  bind:offsetHeight="{height}"
>
  <slot />
</div>

<style>
  .action-options {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;

    max-width: unset;
  }
</style>
