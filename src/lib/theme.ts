// TODO

// import { grey } from "@mui/material/colors";

// const backgroundColor = {
//   light: {
//     bg: grey[200],
//     paper: grey[50],
//   },
//   dark: {
//     bg: grey[900],
//     paper: grey[800],
//   },
// };

export const theme = {
  ajcBlue: {
    light: {
      main: "#233755",
      dark: "#18263B", //"#00112c",
      light: "#4F5F77", //"#4f6182",
      contrastText: "#fff",
    },
    dark: {
      dark: "#233755",
      main: "#4F5F77", //"#4f6182",
      contrastText: "#fff",
    },
  },
  ajcYellow: {
    main: "#ccb76b",
    dark: "#8E804A", //"#99873e",
    light: "#D6C588", //"#ffe99a",
    contrastText: "#000",
  },
  background: (mode: string) => ({
    // default: backgroundColor[mode].bg,
    // paper: backgroundColor[mode].paper,
  }),
};

// export const themeForMode = (mode) => {
//   let newTheme = {};
//   for (let key in theme) {
//     if (typeof theme[key] === "function") newTheme[key] = theme[key](mode);
//     else
//       newTheme[key] = theme[key].hasOwnProperty(mode)
//         ? { ...theme[key][mode] }
//         : { ...theme[key] };
//   }
//   return newTheme;
// };
