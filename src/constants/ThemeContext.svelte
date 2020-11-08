<script>
  import { setContext, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { viewport } from '../store';
  import { preset, defaultTheme } from './themePreset';

  // expose props for customization and set default theme values
  //export let themes = [...preset];

  // state, current theme's name
  let _current = defaultTheme;

  // utility, get theme by name
  const getTheme = (name) => preset().find((t) => t.name === name);

  // Theme-store
  const Theme = writable(getTheme(_current));

  const setIt = () => {
    setContext('theme', {
      // providing Theme-store through context makes store readonly
      theme: Theme,
      // update method
      update: (name) => {
        // if no name provided, just pick next theme
        if (!name) {
          const _currentIndex = themes.findIndex((t) => t.name === _current);

          const nextIndex =
            _currentIndex < themes.length - 1 ? _currentIndex + 1 : 0;

          const nextTheme = getTheme(themes[nextIndex].name);
        }

        const newTheme = getTheme(name || nextTheme);

        // update Theme-store
        Theme.update((t) => ({ ...t, ...newTheme }));
        // update CSS vars
        setRootColors(getTheme(_current));
      },
    });
  };

  setIt();

  onMount(() => {
    // set CSS vars on mount
    setRootColors(getTheme(_current));
  });

  // sets CSS vars for easy use in components
  // ex: var(--theme-background)
  // iterate theme values recursively
  // (handling types null, str, object and arrays. Result val must be str).
  const setRootColors = (theme) => {
    const setVars = ({ key = '--theme', val }) => {
      if (val && typeof val === 'string') {
        document.documentElement.style.setProperty(key, val);
        //console.log('CSS-var', key, ':', val);
      } else if (Array.isArray(val)) {
        if (val.length < 1) return;

        val.forEach((subVal, nth) => {
          setVars({ key: key + '-' + nth, val: subVal });
        });
      } else if (typeof val === 'object' && val !== null) {
        Object.entries(val).forEach(([subKey, subVal]) => {
          setVars({ key: key + '-' + subKey, val: subVal });
        });
      }
    };

    setVars({ val: theme });
  };

  let big = false;
  $: if ($viewport.height > 480 !== big) {
    big = $viewport.height > 480;
    setRootColors(getTheme(_current));
  }
</script>

<slot />
