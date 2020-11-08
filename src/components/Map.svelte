<script>
  import { onMount, onDestroy } from 'svelte';
  import { stores } from '@sapper/app';
  import { geoSearch } from '../utils/dynamicImport';
  import { viewport, delivered, Lstored, carrierData } from '../store';
  import { orderStages, markerData } from '../constants/preset';
  import { timeStamp } from '../utils/helpers';

  const { session } = stores();
  // import T from 'scanex-translations';

  //import { leaflet, routing } from '../dynamicImport';

  // import './Map.css';
  export let destination = 'Slottsbacken 1';
  export let order;

  let mounted = false;
  export let L;
  let streetMap = null;

  let map = null;
  let mapRef = null;
  let router = null;
  let init = false;

  let ABmarkers = null;
  let carrierMarker = null;

  const start = [59.333545, 18.075644]; // restaurant
  let routeEnd = null; // customer
  const initialZoom = 12;
  let routeLine = null;
  let routeLines = null;

  // const headerHeight = getContext ('headerHeight');

  const resize = () => {
    if (!map) return;

    map.invalidateSize();
    //mapRef.style.height = `${window.innerHeight - 80}px`;
  };

  const initMap = () => L.map(mapRef).setView(start, initialZoom);

  const mapLayer = () =>
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 20,
      }
    );

  const newMarkerIcon = ({ src, size = [38, 40], ...props }) =>
    new L.icon({
      iconUrl: src,
      iconSize: size,
      iconAnchor: [size[0] * 0.47, size[1] * 0.95],
      popupAnchor: [-3, -76],
      ...props,
    });

  const createMarker = (data = null) => {
    let arr = Array.isArray(data)
      ? data
      : typeof data === 'object'
      ? [data]
      : null;
    if (!data || !arr) return null;

    const group = arr.map((m) => {
      const marker = new L[m.type](m.coords, {
        ...m.props,
        icon: m.icon || null,
      });

      if (typeof m.popup === 'string' && m.popup !== '') {
        marker.bindPopup(m.popup);
      }
      return marker;
    });

    return group.length === 1 ? group[0] : new L.featureGroup(group);
  };

  const markAsDelivering = async () => {
    const fetched = await fetch('fetch/post', {
      method: 'POST',
      headers: {
        _action: 'updateOrder',
        _url: $session.BACKEND_URL,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...order,
        status: orderStages[2],
        dueDate: timeStamp(null, 60 * 60 * 1000),
      }),
    });

    const res = await fetched.json();

    // console.log('update user res status', res.status);

    if (res.status === 200) {
      // console.log('Order-status uppdaterad i DB', 2);
    } else {
      console.error(
        'Order-status kunde inte uppdateras till 2',
        res.error,
        res.msg
      );
    }
  };

  const addressSearch = async (address, city = 'Stockholm') => {
    const coords = await streetMap.search({ query: `${address}, ${city}` });
    return [coords[0].y, coords[0].x];
  };

  const newRoute = (startEnd) => {
    const waypoints = startEnd.map((x) => ({ latLng: L.latLng(x) }));

    const res = router.route(waypoints, function (err, routes) {
      if (err) {
        return console.error('map route err', err);
      }

      if (order.status.stage !== 2) {
        markAsDelivering();
      }

      // if prev route, clear
      if (routes && routeLine) {
        map.removeLayer(routeLine);
      }

      routeLines = routes;
      routeLine = L.Routing.line(routes[0], {
        styles: [{ color: 'purple', opacity: 0.5, weight: 3 }],
      });

      // routeLine.addTo(map);

      let routeCoords = routeLine._route.coordinates.map((c) => [c.lat, c.lng]);

      if (carrierMarker) map.removeLayer(carrierMarker);

      /* var marker1 = L.Marker.movingMarker([start, routeEnd], [10000], {
        autostart: true,
      }).addTo(map); */
      /* carrierMarker = L.Marker.movingMarker(routeCoords, time, {
        autostart: true,
        icon: newMarkerIcon({src:'img/icon/carrier-east.svg'}),
      }).addTo(map); */

      const routeLatLng = routeLine._route.coordinates.map((c) =>
        L.latLng(c.lat, c.lng)
      );

      let totalDistance = routeLatLng.reduce((tot, next, nth) => {
        if (nth <= 0 || nth >= routeCoords.length) return tot;
        const prev = routeLatLng[nth - 1];
        return tot + prev.distanceTo(next);
      }, 0);

      let prevRun = 0;

      let time = 30;

      if ($carrierData) {
        prevRun = 1 - $carrierData.index / routeCoords.length;
        time = time * prevRun;
        totalDistance = totalDistance * prevRun;
        routeCoords = routeCoords.slice($carrierData.index);
      }

      let interval = time * 2.05;

      let prevDirection = 'west';

      const updateIcon = (direction) => {
        if (carrierMarker) {
          carrierMarker.setIcon(
            newMarkerIcon({
              src: `img/icon/carrier-${direction}.svg`,
            })
          );
        }
      };

      const updateZoom = (index, total) => {
        if (carrierMarker) {
          let padding = index / total < 0.7 ? 60 : 20;

          map.fitBounds([carrierMarker.getLatLng(), routeEnd], {
            maxZoom: 24,
            padding: [padding, padding],
          });
        }
      };

      const onStation = (index, prev, next) => {
        let complete = index / routeCoords.length;
        if (complete < 0.9) {
          let tick = complete < 0.8 ? 80 : 50;
          if (index % tick === 0) {
            updateZoom(index, routeCoords.length);
          }
        }

        if (index <= 0 || index >= routeCoords.length) return true;

        let newDirection = prev[1] < next[1] ? 'east' : 'west';

        if (newDirection !== prevDirection) {
          updateIcon(newDirection);
          prevDirection = newDirection;
        }

        return mounted;
      };

      const onEnd = (endProps = null) => {
        carrierData.set(endProps);

        carrierMarker.setIcon(
          newMarkerIcon({
            src: `img/icon/waiter.svg`,
          })
        );

        setTimeout(() => {
          delivered.set(true);
        }, 2500);
      };

      carrierMarker = createMarker({
        ...markerData.carrier,
        icon: newMarkerIcon({ src: 'img/icon/carrier-west.svg' }),
        coords: routeCoords,
        props: {
          distance: totalDistance,
          interval,
          onStation,
          onEnd,
          startIndex: $carrierData ? $carrierData.index : 0,
        },
      }).addTo(map);

      /* carrierMarker = new L.AnimatedMarker(routeCoords, {
        distance: totalDistance,
        interval,
        onStation,
        onEnd,
        startIndex: $carrierData ? $carrierData.index : 0,
        icon: newMarkerIcon({
          src: 'img/icon/carrier-west.svg',
        }),
      }).addTo(map); */
    });
  };

  const paintRoute = async () => {
    if (!mounted || !map) {
      null;
    }
    routeEnd = await addressSearch(destination);

    if (ABmarkers) map.removeLayer(ABmarkers);

    ABmarkers = createMarker([
      markerData.A,
      { ...markerData.B, coords: routeEnd },
    ]);

    ABmarkers.addTo(map);

    map.fitBounds(ABmarkers.getBounds(), { padding: [40, 40] });

    newRoute([start, routeEnd]);

    resize();
  };

  onMount(async () => {
    mounted = true;
    // leaflet from local script
    //L = window.L;
    // geo search
    streetMap = new (await geoSearch()).OpenStreetMapProvider();
    // setup map
    map = initMap();
    // main map layer
    mapLayer().addTo(map);
    // router
    router = L.Routing.osrmv1();
    // paint route
    paintRoute();
    // update map size
  });

  onDestroy(() => {
    mounted = false;
  });

  // check leaflet instance
  $: if (L) {
    init = ![L.Routing, streetMap, map, mapRef].some((x) => x === null);
  }

  // $: console.log('Map init', init);

  $: if (mounted && map) routeEnd = paintRoute(destination);
</script>

<svelte:window on:resize="{resize}" />

{#if L}
  <div
    class="map"
    bind:this="{mapRef}"
    style="height:{$viewport.height - 80}px;"
  >
    <slot />
  </div>
{:else}
  <h1>Det gick inte att läsa in kartan, prova att ladda om sidan</h1>
{/if}

<style>
  :global(.map) {
    height: 180px;
    width: 100%;
  }
  :global(.leaflet-pane) {
    z-index: 4;
  }

  .map {
    width: 100%;
  }
</style>
