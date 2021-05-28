import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import styled from '@emotion/styled';
import MarketCapHistory from './MarketCapHistory';

const KEY = '69e3fc48c2c8aab69a22c9c5b7631c169d983232';

const TableCont = styled.table`
    width: 100%;
    border: 1px solid #EAE8E6;
    border-collapse: collapse;
`;

const MenuContainer = styled.tr`
    border: 1px solid #EAE8E6;
`;

const PriceContainer = styled.tr`
    border: 1px solid #EAE8E6;
    &:hover {
        background-color: #F1F1F5; 
    }
`;

const PriceItemWrapper = styled.div`
    height: 50px;
    font-size: 1.25em;
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-family: 'KoHo', sans-serif;
`;

const ChangeWrapper = styled.div`
    color: ${props => props.displayChange};
    vertical-align: middle;
    text-align: end;
    width: 100px;
`;

const CoinDisplay = styled.div`
    display: flex;
`;

const NameDetail = styled.div`
    padding-right: 30px;
`;

const CurrencyDetail = styled.div`
    color: grey;
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

const TitleContainer = styled.div`
    padding: 50px 0 50px 20px;
    font-size: 2em;
    background-color: #30507F;
    color: white;
    font-family: "Liberation Mono", monospace;
`;

const LogoImg = styled.img`
    width: 30px;
    height: 30px;
    padding-right: 30px;
`;

const Market = () => {
    const [sortedData, setSortedData] = useState([]);
    const [sortingOrder, setSortingOrder] = useState('ascending');

    const [{ data, loading, error }, refetch] = useAxios({
        url: `https://api.nomics.com/v1/currencies/ticker?key=${KEY}`
    });

    if (loading) return <div>Loading...</div>
    if (error)  return <div>Error!</div>

    console.log(data)

    const sortByName = (property) => () => {
        const newData = data.slice(0, 60).sort((a, b) => {
            
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
            // debugger
            return sortingOrder === 'ascending' ?  propB - propA : propA - propB;
        });

        setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
        setSortedData(newData)
    };

    const numFormatter = (num) => {
        if (num > 999 && num < 1000000) {
            return (num/1000).toFixed(1) + 'K';
        } else if (num > 1000000 && num < 1000000000) {
            return (num/1000000).toFixed(1) + 'M';
        } else if (num > 1000000000) {
            return (num/1000000000).toFixed(1) + 'B';
        } else if (num < 999) {
            return num;
        }
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

    const renderChange = (coin) => {
        const change = parseFloat((coin['1d'].price_change_pct)* 100).toFixed(2);

        if (change > 0) {
            return <div>+ {change}%</div>
        }

        return <div>- {Math.abs(change)}%</div>
    };

    const renderPriceList = () => {
        const coins = sortedData.length === 0 ? data : sortedData;
        return coins.slice(0, 60).map((coin, index) => {
            const price = parseFloat(coin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const marketCap = parseFloat(coin.market_cap).toFixed(2);
            const change = parseFloat((coin['1d'].price_change_pct)* 100).toFixed(2);

            return (
                <tbody>
                    <PriceContainer>
                        <td><PriceItemWrapper>{index+1}</PriceItemWrapper></td>
                        <td>
                            <PriceItemWrapper>
                                <LogoImg src={`${coin.logo_url}`} />
                                <CoinDisplay>
                                    <NameDetail>{coin.name}</NameDetail>
                                    <CurrencyDetail>{coin.currency}</CurrencyDetail>
                                </CoinDisplay>
                            </PriceItemWrapper>
                        </td>
                        <td><PriceItemWrapper>${price}</PriceItemWrapper></td>
                        <td><PriceItemWrapper><ChangeWrapper displayChange={change > 0 ? 'green' : 'red'}>{renderChange(coin)}</ChangeWrapper></PriceItemWrapper></td>
                        <td><PriceItemWrapper>${numFormatter(marketCap)}</PriceItemWrapper></td>
                    </PriceContainer>
                </tbody>
            );
        });
    };

    return (
        <div>
            <Container>
                <TitleContainer>
                    Cryptocurrency Market Prices
                </TitleContainer>
                <MarketCapHistory />
                <ListContainer>
                    <TableCont>
                        {renderMenuList()}
                        {renderPriceList()}
                    </TableCont> 
                </ListContainer>
            </Container>
        </div>
    );
};

export default Market;
