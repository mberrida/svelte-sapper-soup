<script>
  export let placement = 'top-left';
  export let top = placement.substr(0, 3) === 'top' ? true : false;
  export let right = placement.substr(-5) === 'right' ? true : false;
  export let bottom = placement.substr(0, 6) === 'bottom' ? true : false;
  export let left = placement.substr(-4) === 'left' ? true : false;

  export let position = 'fixed';
  export let size = '50px';
  export let margin = '0';
</script>

<a
  class="logo"
  href="/"
  style="
    top:{top ? 0 : 'unset'};
    right:{right ? 0 : 'unset'};
    bottom:{bottom ? 0 : 'unset'};
    left:{left ? 0 : 'unset'};
    position:{position};
    width:{size};
    height:{size};
    margin:{margin};
"
><img src="img/logo/logo-img.png" alt="site logo" /></a>

<style>
  .logo {
    display: block;
    position: absolute;
    z-index: 2;
  }

  .logo:hover {
    transform: rotate(360deg);
    transition: 600ms;
  }

  .logo > img {
    width: 100%;
    height: 100%;
  }
</style>
