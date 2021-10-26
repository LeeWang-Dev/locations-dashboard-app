import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Chart from "react-google-charts";

const useStyles = makeStyles({
   paper:{
       display:'flex',
       flexDirection:'column',
       width:'100%',
       height:'100%',
       marginBottom:20,
       '&.MuiPaper-root':{
           padding:'30px 30px 20px 30px',
           backgroundColor:'transparent',
           border:'4px solid #e3ebf1',
           boxShadow:'none'
       }
   },
   paperHeader:{
       paddingBottom:10,
       marginBottom:20,
       borderBottom:'1px solid #e3ebf1'
   },
});

function Charts(props) {
    const classes = useStyles();
    const { counts } = props;
    const [toggleValue, setToggleValue] = useState('platform');
    const [chartData, setChartData] = useState([]);
    
    const handleToggle = (e, newValue) => {
      if(newValue !== null){
         setToggleValue(newValue);
       }
    }

    useEffect(()=>{
      var newData = [
         ['Platform','Count',{ role: 'style' }],
         ['AAID',parseInt(counts["AAID"]),'#000'],
         ['IDFA',parseInt(counts["IDFA"]),'#000'],
      ];
      setChartData(newData);
    },[counts]);

    return(
       <>
       <Grid container justifyContent="center" style={{marginBottom:40}}>
           <ToggleButtonGroup 
                value={toggleValue} exclusive
                onChange={handleToggle} aria-label="chart button group"
            >
                <ToggleButton value="platform" aria-label="Platform">
                   Platform
                </ToggleButton>
                <ToggleButton value="category_1" aria-label="Category 1">
                   Category 1
                </ToggleButton>
                <ToggleButton value="category_2" aria-label="Category 2">
                   Category 2
                </ToggleButton>
            </ToggleButtonGroup>
       </Grid>
       <Grid container justifyContent="center" style={{width:'100%',height:500, padding:20}}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.paperHeader}>
               Device Platform
            </Typography>   
            <Chart
               width="100%"
               height="100%"
               chartType="PieChart"
               //loader={<div>Loading</div>}
               data={chartData}
               options={{
                  //title: 'Device Platform',
                  //is3D: true,
                  pieHole: 0.5,
                  legend: { position: 'top', alignment: 'center' },
                  backgroundColor: 'transparent'
               }}
               rootProps={{ 'data-testid': '1' }}
               style={{flex:1,opacity:0.9}}
            />
          </Paper>
       </Grid>
       </>
    );
}
export default Charts;