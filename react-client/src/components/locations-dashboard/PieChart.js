import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';

import Chart from "react-google-charts";

const useStyles = makeStyles({
    pieChart:{
        position:'absolute',
        top:100,
        left:10,
        width:160,
        height:160,
        '&.MuiPaper-root':{
           borderRadius:'50%',
           backgroundColor:'rgba(255,255,255,0.7)',
        }
    }
 });

function PieChart(props){
    const classes = useStyles();
    const { counts } = props;
    const [chartData, setChartData] = useState([]);
    
    useEffect(()=>{
        var newData = [
           ['Platform','Count',{ role: 'style' }],
           ['Android',parseInt(counts["aaid"]),'#000'],
           ['iOS',parseInt(counts["idfa"]),'#000'],
        ];
        setChartData(newData);
    },[counts]);

    return(
        <Paper className={classes.pieChart}>
            <Chart
                width="100%"
                height="100%"
                chartType="PieChart"
                //loader={<div>Loading</div>}
                data={chartData}
                options={{
                    //title: 'Device Platform',
                    //is3D: true,
                    pieHole: 0.2,
                    legend: { position: 'top', alignment: 'center' },
                    backgroundColor: 'transparent'
                }}
                rootProps={{ 'data-testid': '1' }}
                style={{flex:1,opacity:0.9}}
            />
        </Paper>
    );
}

export default PieChart;