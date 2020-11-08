<script>
  import { headerHeight, viewport } from '../store';
  export let width = '100%';
</script>

<div class="step-nav">
  <a class="logo" href="/"><img
      src="img/logo/logo-img.png"
      alt="site logo"
    /></a>
  <div class="board" style="--width:{width};">
    <slot />
  </div>
</div>

<style>
  .step-nav {
    display: flex;
    justify-content: center;
    height: var(--theme-stepNav-height);
    width: 100%;
    max-height: unset;
    min-height: unset;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1;
    margin: 0;
  }

  .logo {
    display: block;
    position: absolute;
    z-index: 2;
    top: -30px;
    width: 50px;
    height: 50px;
  }

  .logo:hover {
    transform: rotate(360deg);
    transition: 600ms;
  }

  .logo > img {
    width: 100%;
    height: 100%;
  }

  .board {
    display: flex;
    width: var(--width);
    max-width: var(--theme-maxWidth);
    height: 100%;
    box-shadow: 0px -5px 10px -5px #ccc;
    background: var(--theme-background-primary);
  }

  @media print {
    .step-nav {
      display: none;
      margin: 0 auto;
    }
  }
</style>
