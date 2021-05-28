import React from 'react';
import Market from './Market';
import styled from '@emotion/styled';

const Container = styled.div`
    background-color: white;
`;

const App = () => {
    return (
        <Container>
            <Market />
        </Container>
    )
};

export default App;
