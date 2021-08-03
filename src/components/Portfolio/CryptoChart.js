import React from 'react';
import useAxios from 'axios-hooks';
import { Line } from 'react-chartjs-2';

const KEY = '69e3fc48c2c8aab69a22c9c5b7631c169d983232';

const now = new Date();
const pastDate = new Date(now);
pastDate.setDate(now.getDate() - 365);
const startDate = encodeURIComponent(pastDate.toISOString().substring(0, 23));
const encodedStartDate = `${startDate}Z`;

const CryptoChart = (props) => {
    const { item } = props;
  
    const [{ data, loading, error }] = useAxios({
        url: `https://api.nomics.com/v1/exchange-rates/history?key=${KEY}&currency=${item.symb}&start=${encodedStartDate}`
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
                borderColor: 'grey'
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

