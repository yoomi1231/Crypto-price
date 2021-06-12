import React from 'react';
import Market from './Market';
import styled from '@emotion/styled';

const Container = styled.div`
    background-color: white;
    font-family: 'Lato', sans-serif;
`;

const NomicsAttribution = styled.a`
    width: 90vw;
    padding-top: 10px;
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
            <Market />
            <NomicsAttribution href="https://nomics.com">
                Crypto Market Cap & Pricing Data Provided By Nomics
            </NomicsAttribution>
        </Container>
    );
};

export default App;
