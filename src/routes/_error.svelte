<script>
  import { stores } from '@sapper/app';
  import ActionBtn from '../components/ActionBtn.svelte';
  export let status;
  export let error;

  const { page } = stores();

  let leafletError =
    status === 404 &&
    error.name === 'PreloadError' &&
    $page.path.substr(0, 8) === '/leaflet';

  if (error && status !== 200 && !leafletError) {
    if (error) {
      console.error('Error:', status, error);
      console.trace('$page', $page, status, error);
    }
  }

  const dev = process.env.NODE_ENV === 'development';
</script>

<svelte:head>
  <title>Svelte Sapper Soup! Sidan saknas</title>
</svelte:head>

<div class="container">
  <h1>Åh nej</h1>
  <h2>Den här sidan har inga soppor</h2>
  <img src="img/empty-soup.png" alt="empty soup bowl" />
  <div class="btn">
    <ActionBtn href="/" margin="0 auto">Till sopporna!</ActionBtn>
  </div>
</div>

<style>
  .container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  h1 {
    font-weight: 700;
  }

  img {
    width: 200px;
    height: auto;
    margin: 0 auto;
  }

  div.btn {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    width: 80%;
    max-width: 400px;
  }
</style>
