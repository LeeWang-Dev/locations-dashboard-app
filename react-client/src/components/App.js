import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Locations_Dashboard from "./locations-dashboard/Main.js";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
       <Locations_Dashboard />
    </ThemeProvider>
  );
}

export default App;
