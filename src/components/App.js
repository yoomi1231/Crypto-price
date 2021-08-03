import React, { useState, useReducer, useEffect } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import useAxios from 'axios-hooks';
import history from '../history';
import styled from '@emotion/styled';
import PriceList from './Market/PriceList';
import AssetList from './Portfolio/AssetList';
import NavBar from './NavBar';
import Modal from 'react-modal';
import Trade from './Market/Trade';
import CryptoChart from './Portfolio/CryptoChart';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    font-family: 'Lato', sans-serif;
    background-color: #f1f1f1;
`;

const StyledModal = styled(Modal)`
    width: 50%;
    height: 50%;
    margin: auto;
    text-align: center; 
    border: 1px solid black;
    margin-top: 10%;
    padding-top: 50px;
    background-color: #d3dde3;
`;

 const PortfolioContainer = styled.div`
    display: flex;
    flex-direction: column;
 `;

const KEY = '69e3fc48c2c8aab69a22c9c5b7631c169d983232';

const assetData = {
    usd: {
        name: "US Dollar",
        total_amount: 1000000,
    }
};

const reducer = (state, action) => {
    let updatedTotal;
    let updatedUSD;
    let updatedCoin;

    switch (action.type) {
        case 'buy':
            updatedTotal = state.usd.total_amount - parseFloat(action.payload.amt);
            updatedUSD = state['usd'];
            updatedUSD.total_amount = updatedTotal;
            
            if (!state[action.payload.coin_symb]) {
                return { 
                    ...state, 
                    usd: updatedUSD,
                    [action.payload.coin_symb]: 
                    { 
                        name: action.payload.coin_name,
                        symb: action.payload.coin_symb,
                        total_amount: action.payload.amt,
                        total_num: action.payload.coin_num
                    }
                }
            } else {
                updatedCoin = state[action.payload.coin_symb];
                updatedCoin.total_amount = parseFloat(state[action.payload.coin_symb].total_amount) + parseFloat(action.payload.amt);
                updatedCoin.total_num = parseFloat(state[action.payload.coin_symb].total_num) + parseFloat(action.payload.coin_num);
                return {
                    ...state,
                    usd: updatedUSD,
                    [action.payload.coin_symb]: updatedCoin
                }
            }         
        case 'sell':
            if (state[action.payload.coin_symb]) {
                updatedTotal = state.usd.total_amount + parseFloat(action.payload.amt);
                updatedUSD = state['usd'];
                updatedUSD.total_amount = updatedTotal;
                updatedCoin = state[action.payload.coin_symb];
                updatedCoin.total_amount = parseFloat(state[action.payload.coin_symb].total_amount) - parseFloat(action.payload.amt);
                updatedCoin.total_num = parseFloat(state[action.payload.coin_symb].total_num) - parseFloat(action.payload.coin_num);
                return {
                    ...state,
                    usd: updatedUSD,
                    [action.payload.coin_symb]: updatedCoin
                }
            } else {
                return state;
            } 
        default:
            return state;
    } 
};

const App = () => {
    const [amt, setAmt] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [crypto, setCrypto] = useState();
    const [state, dispatch] = useReducer(reducer, assetData, () => {
        const localData = localStorage.getItem('storedData');
        return localData ? JSON.parse(localData) : assetData;
    });
    const [chartVisible, setChartVisible] = useState(false);
    const [selectedChart, setSelectedChart] = useState();

    useEffect(() => {
        localStorage.setItem('storedData', JSON.stringify(state));
    }, [state]);


    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const onTradeClick = (coin) => () => {
        setCrypto(coin);
        toggleModal();
    };

    const onCoinBuyClick = () => {
        dispatch({ type: 'buy', payload: { amt: amt, coin_symb: crypto.currency,  coin_name: crypto.name, coin_num: amt/crypto.price } });
        toggleModal();
    };

    const onCoinSellClick = (coin) => {
        dispatch({ type: 'sell', payload: { amt: amt, coin_symb: crypto.currency,  coin_name: crypto.name, coin_num: amt/crypto.price } });
        toggleModal();
    };

    const toggleChartModal = () => {
        setChartVisible(!chartVisible);
    };

    const onViewChartClick = (coin) => () => {
        setSelectedChart(coin);
        toggleChartModal();
    };

    const [{ data, loading, error }, refetch] = useAxios({
        url: `https://api.nomics.com/v1/currencies/ticker?key=${KEY}&per-page=100&page=${currentPage}`
    });

    if (loading) return <div>Loading...</div>
    if (error)  return <div>...</div>

    return (
        <div>
            <Router history={history}>
                <Container>
                    <NavBar />
                    <Switch>
                        <Route path="/portfolio" exact>
                            <PortfolioContainer>
                                <AssetList myUSD={state.usd.total_amount} curAsset={state} data={data} refetch={refetch} onViewChartClick={onViewChartClick} cryptoChart={selectedChart} />
                            </PortfolioContainer>
                        </Route> 
                        <Route path="/" exact>
                            <PriceList onTradeClick={onTradeClick} data={data} currentPage={currentPage} updateCurrentPage={setCurrentPage} />
                        </Route> 
                    </Switch>
                </Container>
                <StyledModal
                    isOpen={isOpen} 
                    onRequestClose={toggleModal}
                    ariaHideApp={false} 
                >
                    <Trade onCoinBuyClick={onCoinBuyClick} onCoinSellClick={onCoinSellClick} toggleModal={toggleModal} item={crypto} amt={amt} setAmt={setAmt} />
                </StyledModal>
                <StyledModal
                    isOpen={chartVisible} 
                    onRequestClose={toggleChartModal}
                    ariaHideApp={false} 
                >
                    <CryptoChart item={selectedChart} />
                </StyledModal>
            </Router>    
        </div>
    );
};

export default App;