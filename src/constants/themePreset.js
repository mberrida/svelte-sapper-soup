import { viewport } from '../store';

let v = { height: 0 };
const byePort = viewport.subscribe((val) => {
  v = val ? val : v;
});

const preset = () => [
  {
    name: 'main',
    color: {
      primary: '#444',
      secondary: '#eee',
      pop: {
        primary: '#CEA36F',
        secondary: '#DBCEBA',
        third: '#EDE4D7',
        dark: '#b88700',
      },
      grey: { primary: '#CCCCCC', secondary: '#D8D8D8', third: '#EAEAEA' },
      brown: { primary: '#4E4637', secondary: '#B4AA99', third: '#DBCEBA' },
      blue: { primary: '#718FCE', secondary: '#AAC6FF' },
      info: { primary: '#FF8E4B', secondary: '#FFFF87' },
      error: { primary: '#AA4749', secondary: '#FFFF87' },
      success: { primary: '#40BC5F', secondary: '#50EB77', third: '#b0ffc4' },
    },
    background: {
      primary: '#eee',
      secondary: '#444',
      pop: {
        primary: '#DBCEBA',
        secondary: '#CEA36F',
        third: '#EDE4D7',
        fourth: '#ffc57a',
      },
      grey: {
        primary: '#D8D8D8',
        secondary: '#CCCCCC',
        third: '#EAEAEA',
      },
      blue: {
        primary: '#AAC6FF',
        secondary: '#718FCE',
      },
      brown: { primary: '#B4AA99', secondary: '#4E4637', third: '#DBCEBA' },
    },

    radius: '4px',
    border: { primary: '#444 solid 1px', secondary: '#bbb dotted 1px' },
    borderRadius: '2px',

    title: { fontSize: { primary: '30px', secondary: '18px', third: '14px' } },
    p: { fontSize: '12px' },
    btn: {
      fontSize: {
        primary: '20px',
        secondary: '16px',
        third: '12px',
        xl: '21px',
      },
      height: v.height > 480 ? '80px' : '50px',
      width: '400px',
    },
    footer: {
      height: v.height > 480 ? '80px' : '50px',
    },
    stepNav: {
      height: v.height > 480 ? '80px' : '50px',
    },
    maxWidth: '1000px',
  },
];

const defaultTheme = 'main';

export { preset, defaultTheme };
