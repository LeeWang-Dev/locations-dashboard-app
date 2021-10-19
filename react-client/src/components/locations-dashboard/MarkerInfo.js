import React, { useEffect } from 'react';
import Drawer from '@mui/material/Drawer';

function MarkerInfo(props) {
    const {
        markerInfo,
        setMarkerInfo
    } = props;

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setMarkerInfo({
            ...markerInfo,
            open: open
        });
    };

   useEffect(()=>{
      console.log(markerInfo);
   }, [markerInfo]);

   return (
        <Drawer
            ModalProps={{
               container:document.getElementById("map-container"),
               style: {position:'absolute'}
            }}
            anchor="right"
            open={true}
            onClose={toggleDrawer(false)}
        >
        maker info details
        </Drawer>
   );
}

export default MarkerInfo;