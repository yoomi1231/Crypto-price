import React from 'react';
import useAxios from 'axios-hooks';
import { Line } from 'react-chartjs-2';

const KEY = '69e3fc48c2c8aab69a22c9c5b7631c169d983232';

const getDate = (d) => {
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())+'T'
         + pad(d.getUTCHours())+'%3A'
         + pad(d.getUTCMinutes())+'%3A'
         + pad(d.getUTCSeconds())+'Z'
};

const d = new Date();
const TODAY = getDate(d); 
const START = getDate(new Date(d.setDate(d.getDate()-365)));

const CryptoChart = (props) => {
    const { item } = props;
  
    const [{ data, loading, error }] = useAxios({
        url: `https://api.nomics.com/v1/exchange-rates/history?key=${KEY}&currency=${item.symb}&start=${START}`
    });

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error!</div>

    const extractRateData = (data) => {
        let rateData = [];
        for (let i = 0; i < data.length; i++) {
            rateData.push(data[i].rate);
        }
        return rateData;
    };

    const extractTimeData = (data) => {
        let timeData = [];
        for (let i = 0; i < data.length; i++) {
            let date = data[i].timestamp.substring(0,10);
            timeData.push(date);
        }
        return timeData;
    };
    
    const rateHistory = {
        labels: extractTimeData(data),
        datasets: [
            {
                label: item.name,
                data: extractRateData(data),
                fill: false,
                borderBolor: 'black'
            }
        ]
    };

    return(
        <div>
            <Line data={rateHistory} />
        </div>
    );  
};

export default CryptoChart;

