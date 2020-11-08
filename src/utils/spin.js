import { expoInOut } from 'svelte/easing';

export default (node, { duration }) => {
  return {
    duration,
    css: (t, u) => {
      const eased = expoInOut(t);

      return `
        transform:  rotate(${eased * 360}deg) scale(${
        u > 0.5 ? (eased + 1) * 1.5 : u + 1
      });
         
        color: hsl(
          ${~~(t * 360)},
          ${Math.min(100, 1000 - 1000 * t)}%,
          ${Math.min(50, 500 - 500 * t)}%
        );
      `;
    },
  };
};
