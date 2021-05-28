import React from 'react';
import useAxios from 'axios-hooks';
import styled from '@emotion/styled';
import Market from './Market';

const KEY = '69e3fc48c2c8aab69a22c9c5b7631c169d983232';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 1em;
    padding-top: 20px;
    padding-bottom: 20px;
    height: 70px;
`;

const Wrapper = styled.div`
    font-size: 24px;
    font-weight: 700;
    display: flex;
    flex-direction: row;
`;

const UpValueContainer = styled.div`
    color: green;
    padding-left: 10px;
`;

const DownValueContainer = styled.div`
    color: rgb(223, 95, 103);
    padding-left: 10px;
`;

const Statement = styled.span`
    color: #716B6E;
`;


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
const YESTERDAY = getDate(new Date(d.setDate(d.getDate()-1)));


const MarketCapHistory = () => {
    const [{ data, loading, error }] = useAxios({
        url: `https://api.nomics.com/v1/market-cap/history?key=${KEY}&start=${YESTERDAY}&end=${TODAY}`
    })

    if (loading) return <div>Loading...</div>
    if (error)  return <div>Error!</div>



    const marketCapDifference = () => {
        const changeValue = ((data[0].market_cap - data[22].market_cap) / data[0].market_cap * 100).toFixed(2);

        if (changeValue < 0) {
            return (
                <Wrapper>
                    <div>Market is UP</div>
                    <UpValueContainer>{Math.abs(changeValue)}%</UpValueContainer>
                </Wrapper>
            );
        } 

        return (
            <Wrapper>
                <div>Market is DOWN</div>
                <DownValueContainer>{Math.abs(changeValue)}%</DownValueContainer>
            </Wrapper>
        );
    
    };

    return (
        <div>
            <Container>
                <Statement>In the past 24 hours</Statement>
                <span>{marketCapDifference()}</span>  
            </Container>
        </div>
    );
};
export default MarketCapHistory;

