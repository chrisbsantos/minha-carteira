import React from "react";
import CountUp from 'react-countup';


import dollarImg from '../../assets/dollar.svg'
import arrowUpImg from '../../assets/arrow-up.svg'
import arrowDownImg from '../../assets/arrow-down.svg'

import { Container } from './styles'

interface IWalletBoxProp {
    title: string;
    amount: number;
    footerLabel: string;
    icon: 'dollar' | 'arrowUp' | 'arrowDown';
    color: string;
}

const WalletBox: React.FC<IWalletBoxProp> = ({
    title,
    amount,
    footerLabel,
    color, icon
}) => {

    const iconList = {
        dollar: dollarImg,
        arrowUp: arrowUpImg,
        arrowDown: arrowDownImg,
    }

    return (
        <Container color={color}>
            <span>{title}</span>
            <h1>
                <CountUp 
                    end={amount}
                    prefix="R$ "
                    separator="."
                    decimal=","
                    decimals={2}
                />
                </h1>
            <small>{footerLabel}</small>
            <img src={iconList[icon]} alt={title} />
        </Container>
    );

    // const iconSelected = () => {
    //     switch (icon) {
    //         case 'dollar':
    //             return dollarImg
    //         case 'arrowUp':
    //             return arrowUpImg
    //         case 'arrowDown':
    //             return arrowDownImg
    //     }
    // }

    // return (
    //     <Container color={color}>
    //         <span>{title}</span>
    //         <h1>{amount}</h1>
    //         <small>{footerLabel}</small>
    //         <img src={iconSelected()} alt={title} />
    //     </Container>
    // );
}

export default WalletBox;