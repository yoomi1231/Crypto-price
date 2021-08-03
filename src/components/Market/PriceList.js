import React, { useState } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import MarketCapHistory from './MarketCapHistory';
import CoinDetail from './CoinDetail';
import Pagination from './Pagination';

const Container = styled.div`
    width: 80vw;
    padding-left: 50px;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const NomicsAttribution = styled.a`
    width: 80vw;
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

const StyledTable = styled.table`
    width: 100%;
    border: 1px solid #EAE8E6;
    border-collapse: collapse;
`;

const MenuContainer = styled.tr`
    border: 1px solid #EAE8E6;
`;

const MenuItemWrapper = styled.div`
    height: 50px;
    font-size: 1em;
    display: flex;
    align-items: center;
    padding-left: 10px;
    &:hover {
        color: blue;
        cursor: pointer;
    }
`;

const ListContainer = styled.div`
    background-color: rgb(246, 249, 252);
`;

const TitleContainer = styled.div`
    padding: 50px 0 50px 20px;
    font-size: 2em;
    background-color: #30507F;
    color: white;
    font-family: "Liberation Mono", monospace;
`; 

const PriceList = (props) => {
    const { onTradeClick, data, currentPage, updateCurrentPage } = props;

    const [sortedData, setSortedData] = useState([]);
    const [sortingOrder, setSortingOrder] = useState('ascending');
 

    const sortByName = (property) => () => {
        const newData = data.sort((a, b) => {
            
            let propA = a[property];
            let propB = b[property];
            
            return sortingOrder === 'ascending' ? propB < propA ? -1 : 1 : propA < propB ? -1 : 0;
        });

        setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
        setSortedData(newData)
    };

    const sortByAmount = (property) => () => {  
        const newData = data.slice(0, 60).sort((a, b) => {
            let propA = a[property];
            let propB = b[property];
            return sortingOrder === 'ascending' ?  propB - propA : propA - propB;
        });

        setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
        setSortedData(newData)
    };

    const sortByChange = (property) => () => {
        const newData = data.slice(0, 60).sort((a, b) => {
            let propA = a['1d'][property];
            let propB = b['1d'][property];
            return sortingOrder === 'ascending' ?  propB - propA : propA - propB;
        });

        setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
        setSortedData(newData)
    };

    const renderMenuList = () => {
        return(
            <tbody>
                <MenuContainer>
                    <th><MenuItemWrapper>#</MenuItemWrapper></th>
                    <th><MenuItemWrapper onClick={sortByName('name')}>Name</MenuItemWrapper></th>
                    <th><MenuItemWrapper onClick={sortByAmount('price')}>Price</MenuItemWrapper></th>
                    <th><MenuItemWrapper onClick={sortByChange('price_change_pct')}>Change</MenuItemWrapper></th>
                    <th><MenuItemWrapper onClick={sortByAmount('market_cap')}>Market Cap</MenuItemWrapper></th>
                </MenuContainer>
            </tbody>       
        );
    };

    const renderPriceList = () => {
        const coins = sortedData.length === 0 ? data : sortedData;
        return coins.map((coin, index) => {
            const price = parseFloat(coin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const marketCap = parseFloat(coin.market_cap).toFixed(2);
            const change = parseFloat(_.get(coin['1d'], "price_change_pct", "") * 100).toFixed(2);

            return (
                <CoinDetail key={`${coin}-${index}`}
                    coin={coin}
                    index={index}
                    price={price}
                    marketCap={marketCap}
                    change={change} 
                    currentPage={currentPage}
                    onTradeClick={onTradeClick}
                />
            );
        });
    };

    const paginatedData = sortedData.length === 0 ? data : sortedData;

    return (
        <div>
            <Container>
                <NomicsAttribution href="https://nomics.com">
                    Crypto Market Cap & Pricing Data Provided By Nomics
                </NomicsAttribution>
                <TitleContainer>
                    Cryptocurrency Market Prices
                </TitleContainer>
                <MarketCapHistory />
                <ListContainer>
                    <StyledTable>
                        {renderMenuList()}
                        {renderPriceList()}
                    </StyledTable> 
                </ListContainer>
                <Pagination data={paginatedData} pageLimit={10} dataLimit={50} currentPage={currentPage} updateCurrentPage={updateCurrentPage} />
            </Container>
        </div>
    );
};

export default PriceList;