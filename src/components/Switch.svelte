<script>
  export let checked = false;

  export let color = {
    true: 'var(--theme-background-grey-secondary)',
    false: 'var(--theme-background-primary)',
  };
</script>

<label class="switch">
  <input type="checkbox" bind:checked />
  <span class="slider" style="background:{color[checked]};"></span>
</label>

<style>
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
  input + .slider {
    box-shadow: inset 0 0 8px -1px #000;
  }

  input:checked + .slider {
    background-color: var(--theme-background-pop-primary);
  }

  .slider::before {
    background: var(--theme-background-secondary);
    box-shadow: 0px 0px 1px 2px #000;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
</style>
