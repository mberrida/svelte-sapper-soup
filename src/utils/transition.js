import { expoOut } from 'svelte/easing';
export const enterTransition = (stageDirection) => (props = {}) => {
  const val = props.val || 50;
  const duration = props.duration || 400;
  const easing = props.easing || expoOut;
  const delay = props.delay || 0;

  const axis =
    stageDirection === 'left' || stageDirection === 'right' ? 'x' : 'y';
  const coord =
    stageDirection === 'right' || stageDirection === 'bottom' ? val : -val;

  return {
    [axis]: coord,
    duration,
    easing,
    delay,
  };
};

export const exitTransition = (stageDirection) => (props = {}) => {
  const val = props.val || 50;
  const duration = props.duration || 400;
  const easing = props.easing || expoOut;
  const delay = props.delay || 0;

  const axis =
    stageDirection === 'left' || stageDirection === 'right' ? 'x' : 'y';
  const coord =
    stageDirection === 'right' || stageDirection === 'bottom' ? -val : val;

  return {
    [axis]: coord,
    duration,
    easing,
    delay,
  };
};
