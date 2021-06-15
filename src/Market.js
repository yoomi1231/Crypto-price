import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import _ from 'lodash';
import styled from '@emotion/styled';
import MarketCapHistory from './MarketCapHistory';
import CoinDetail from './CoinDetail';
import Pagination from './Pagination';

const KEY = '69e3fc48c2c8aab69a22c9c5b7631c169d983232';

const TableCont = styled.table`
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

const Container = styled.div`
    width: 80vw;
    margin: auto;
`;

const ListContainer = styled.div`
    background-color: rgb(246, 249, 252);
`;

const Market = () => {
    const [sortedData, setSortedData] = useState([]);
    const [sortingOrder, setSortingOrder] = useState('ascending');
    const [currentPage, setCurrentPage] = useState(1);

    const [{ data, loading, error }, refetch] = useAxios({
        url: `https://api.nomics.com/v1/currencies/ticker?key=${KEY}&per-page=50&page=${currentPage}`
    });

    if (loading) return <div>Loading...</div>
    if (error)  return <div>Error!</div>

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
        const newData = data.sort((a, b) => {
            let propA = a[property];
            let propB = b[property];
            return sortingOrder === 'ascending' ?  propB - propA : propA - propB;
        });

        setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
        setSortedData(newData)
    };

    const sortByChange = (property) => () => {
        const newData = data.sort((a, b) => {
            let propA = a['1d'][property];
            let propB = b['1d'][property];
            // debugger
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
                />
            );
        });
    };

    const paginatedData = sortedData.length === 0 ? data : sortedData;
    return (
        <div>
            <Container>
                <MarketCapHistory />
                <ListContainer>
                    <TableCont>
                        {renderMenuList()}

                        {renderPriceList()}
                    </TableCont> 
                </ListContainer>
                <Pagination data={paginatedData} pageLimit={10} dataLimit={50} currentPage={currentPage} updateCurrentPage={setCurrentPage} />
            </Container>
        </div>
    );
};

export default Market;
