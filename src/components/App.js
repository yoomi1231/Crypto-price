import React, { useState, useReducer } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import useAxios from 'axios-hooks';
import history from '../history';
import styled from '@emotion/styled';
import PriceList from './Market/PriceList';
import AssetList from './Portfolio/AssetList';
import NavBar from './NavBar';
import Modal from 'react-modal';
import Trade from './Market/Trade';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    font-family: 'Lato', sans-serif;
    background-color: #f1f1f1;
`;

const TradeModal = styled(Modal)`
    width: 50%;
    height: 50%;
    margin: auto;
    text-align: center; 
    border: 1px solid black;
    margin-top: 10%;
    padding-top: 20px;
    background-color: white;
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
            throw state;
    } 
};

const App = () => {
    const [amt, setAmt] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [state, dispatch] = useReducer(reducer, assetData);
    const [isOpen, setIsOpen] = useState(false);
    const [item, setItem] = useState();

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const onTradeClick = (coin) => () => {
        setItem(coin);
        toggleModal();
    };

    const onCoinBuyClick = () => {
        dispatch({ type: 'buy', payload: { amt: amt, coin_symb: item.currency,  coin_name: item.name, coin_num: amt/item.price } });
        toggleModal();
    };

    const onCoinSellClick = (coin) => {
        dispatch({ type: 'sell', payload: { amt: amt, coin_symb: item.currency,  coin_name: item.name, coin_num: amt/item.price } });
        toggleModal();
    };

    const [{ data, loading, error }, refetch] = useAxios({
        url: `https://api.nomics.com/v1/currencies/ticker?key=${KEY}&per-page=50&page=${currentPage}`
    });

    if (loading) return <div>Loading...</div>
    if (error)  return <div>...</div>

    return (
        <div>
            <Router history={history}>
                <Container>
                    <NavBar />
                    <Switch>
                        <Route path="/" exact>
                            <AssetList myUSD={state.usd.total_amount} curAsset={state} data={data} refetch={refetch} />
                        </Route> 
                        <Route path="/market" exact>
                            <PriceList onTradeClick={onTradeClick} data={data} currentPage={currentPage} updateCurrentPage={setCurrentPage} />
                        </Route> 
                    </Switch>
                </Container>
                <TradeModal
                    isOpen={isOpen} 
                    onRequestClose={toggleModal}
                    ariaHideApp={false} 
                >
                    <Trade onCoinBuyClick={onCoinBuyClick} onCoinSellClick={onCoinSellClick} toggleModal={toggleModal} item={item} amt={amt} setAmt={setAmt} />
                </TradeModal>
            </Router>    
        </div>
    );
};

export default App;