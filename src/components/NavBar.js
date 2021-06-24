import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const StyledContainer = styled.div`
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 200px;
    justify-content: initial;
    border-right: 1px solid black;
    text-align: center;
    background-color: white;
`;

const TitleWrapper = styled.div`
    padding: 20px;
    height: 300px;
    font-size: 1.5em;
    font-family: 'Rubik', sans-serif;
    text-align: start;
    color: #10298b;

`;

const MenuWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 700px;
    justify-content: initial;
    padding-top: 100px;
`;

const MenuLink = styled(Link)`
    text-decoration: none;
    font-size: 1.4em;
    color: #10298b;
    padding-bottom: 60px;
    &:hover {
        font-weight: bold;
        cursor: pointer;
    }
`;

const NavBar= () => {
    return(
        <StyledContainer>
            <TitleWrapper>Cryptocurrency Trading Simulator</TitleWrapper>
            <MenuWrapper>
                <MenuLink to="/portfolio">Portfolio</MenuLink>
                <MenuLink to="/">Market</MenuLink>
            </MenuWrapper>
        </StyledContainer>
    );
};

export default NavBar;