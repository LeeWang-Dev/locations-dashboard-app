import React from 'react';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import Locations_Dashboard from "./locations-dashboard/Main.js";

let theme = createTheme({
  components:{
    MuiPaper:{
      styleOverrides: {
        root: {
          padding:10,
          boxShadow:'0px 24px 48px -4px #06192114'
        },
      },
    },
    MuiTypography:{
      styleOverrides: {
        root:{
           lineHeight:'normal'
        }
     }
    },
    MuiButton:{
      styleOverrides: {
         root:{
            padding:'16px 20px',
            borderRadius:50,
            lineHeight:'normal',
            textTransform:'none'
         }
      }
    },
    MuiTextField:{
      styleOverrides: {
        root: {
          boxSizing:'border-box'
        },
      },
    },
    MuiOutlinedInput:{
      styleOverrides: {
        root:{
           padding:'0 16px',
           borderRadius:72,
           backgroundColor:'#f1f6fa'
        },
        input:{
           padding:'14px 8px',
           color:'#162c36'
        },
        notchedOutline: {
          border:0
        },
      },
    },
    MuiToggleButtonGroup:{
      styleOverrides: {
        root: {
          borderRadius:50,
          backgroundColor:'#e3ebf1'
        },
        grouped:{
          '&:first-of-type':{
            marginLeft:0,
          },
          '&:last-of-type':{
            marginRight:0,
          },
          '&:not(:first-of-type)':{
            borderTopLeftRadius:50,
            borderBottomLeftRadius:50
          },
          '&:not(:last-of-type)':{
            borderTopRightRadius:50,
            borderBottomRightRadius:50
          }
        }
      },
    },
    MuiToggleButton:{
      styleOverrides: {
        root: {
          border:0,
          borderRadius:50,
          textTransform: 'none',
          padding:'10px 20px',
          marginLeft:10,
          marginRight:10,
          '&.Mui-selected':{
            color:'#fff',
            backgroundColor:'#ff844b'
          }
        }
      }
    },
    MuiInputAdornment:{
      styleOverrides: {
        root:{
          color:'#ff844b'
        }
      }
    },
    MuiIconButton:{
      styleOverrides: {
        root:{
          color:'#ff844b'
        }
      }
    },  
    MuiBackdrop:{
      styleOverrides: {
         root:{
            //backgroundColor:'rgba(0,0,0,0.8)'
         }
      }
   },
   MuiDialog:{
    styleOverrides: {
       root:{
          '& .MuiDialog-paper':{
             width:480,
             paddingTop:20,
             paddingBottom:20,
             paddingLeft:30,
             paddingRight:30
          }
       }
    }
   },
   MuiDialogTitle:{
    styleOverrides: {
       root:{
          //marginBottom: 20,
          borderBottom:'1px solid #e3ebf1'
       }
    }
   },
   MuiDialogContent:{
    styleOverrides: {
       root:{
          padding: 10
       }
    }
   },
   MuiDialogActions:{
    styleOverrides: {
       root:{
          padding:20
       }
    }
   },
   MuiListItemButton:{
    styleOverrides:{
       root:{
          borderRadius:8,
          '&:hover':{
            backgroundColor:'#f1f6fa'
          }
       }
    }
  }
 }
});

theme = responsiveFontSizes(theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
       <Locations_Dashboard />
    </ThemeProvider>
  );
}

export default App;
