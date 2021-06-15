import React from 'react';
import Market from './Market';
import styled from '@emotion/styled';

const Container = styled.div`
    background-color: white;
    font-family: 'Lato', sans-serif;
`;

const TitleContainer = styled.div`
    width: 80vw;
    margin: auto;
    padding: 50px 0 50px 20px;
    font-size: 2em;
    background-color: #30507F;
    color: white;
    font-family: "Liberation Mono", monospace;
`;

const NomicsAttribution = styled.a`
    width: 90vw;
    padding-bottom: 5px;
    display: flex;
    justify-content: flex-end;
    text-decoration: none;
    color: black;
    &:hover {
        text-decoration: underline;
        text-decoration-color: blue;
    }
`;

const App = () => {
    return (
        <Container>
            <NomicsAttribution href="https://nomics.com">
                Crypto Market Cap & Pricing Data Provided By Nomics
            </NomicsAttribution>
            <TitleContainer>
                Cryptocurrency Market Prices
            </TitleContainer>
            <Market />
        </Container>
    );
};

export default App;
