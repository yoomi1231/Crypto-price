import React from 'react';
import styled from '@emotion/styled';

const Title = styled.span`
    font-size: 2em;
`;

const InputContainer = styled.div`
    margin: 50px;
`;

const InputForm = styled.form`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: auto;
    width: 300px;
`;
 
const Trade = ({ onCoinBuyClick, onCoinSellClick, toggleModal, item, amt , setAmt }) => {
    return ( 
        <div>
            <Title>You want to trade {item.name}?</Title>
            <InputContainer>
                <InputForm 
                    onSubmit={(e) => {
                        e.preventDefault();
                        onCoinBuyClick(amt);
                    }}
                >
                    <div>
                        <label>$</label>
                        <input 
                            type="text" 
                            name="price" 
                            placeholder="0" 
                            onChange={e => setAmt(e.target.value)}
                        />
                    </div>
                    <input type="submit" value="Buy"/>
                </InputForm>
            </InputContainer>
            <InputContainer>
                <InputForm   
                    onSubmit={(e) => {
                        e.preventDefault();
                        onCoinSellClick(amt);
                    }}
                >   
                    <div>
                        <label>$</label>
                        <input
                            
                            type="text" 
                            name="price" 
                            placeholder="0" 
                            onChange={e => setAmt(e.target.value)}
                        />
                    </div>
                    <input type="submit" value="Sell" />         
                </InputForm> 
            </InputContainer>
            <InputContainer>
                <button onClick={toggleModal}>Cancel</button>
            </InputContainer>
        </div>
    );
};

export default Trade;