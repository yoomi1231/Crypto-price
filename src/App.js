import React from 'react';
import Market from './Market';
import styled from '@emotion/styled';

const Container = styled.div`
    background-color: white;
    font-family: 'Lato', sans-serif;

`;

const NomicsAttribution = styled.span`
    width: 90vw;
    padding-top: 5px;
    display: flex;
    justify-content: flex-end;
    text-decoration: underline;
    color: black;
`;

const App = () => {
    return (
        <Container>
            <Market />
            <NomicsAttribution>
                <a href="https://nomics.com">Crypto Market Cap & Pricing Data Provided By Nomics</a>
            </NomicsAttribution>
        </Container>

    )
};

export default App;
