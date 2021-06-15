import React from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';

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


const LogoImg = styled.img`
    width: 30px;
    height: 30px;
    padding-right: 30px;
`;


const CoinDetail = ({ price, marketCap, change, coin, index, currentPage }) => {
    // if (!coin) return null;

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

    const renderChange = (coin) => {
        const change = parseFloat(_.get(coin['1d'], "price_change_pct", "") * 100).toFixed(2);

        if (change > 0) {
            return <div>+ {change}%</div>
        }

        return <div>- {Math.abs(change)}%</div>
    };

    return (
        <tbody>
            <PriceContainer>
                <td><PriceItemWrapper>{(index+1) + (currentPage-1)*50}</PriceItemWrapper></td>
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
   
};

export default CoinDetail;