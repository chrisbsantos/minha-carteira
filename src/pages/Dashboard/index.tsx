import React, { useMemo, useState } from "react";

import ContentHeader from "../../components/ContentHeader";
import SelectInput from "../../components/SelectInput";
import WalletBox from "../../components/WalletBox";
import MessageBox from "../../components/MessageBox";
import PieChartBox from "../../components/PieChartBox";
import HistoryBox from "../../components/HistoryBox";

import happyImg from '../../assets/happy.svg'
import sadImg from '../../assets/sad.svg'
import grinningImg from '../../assets/grinning.svg'

import gains from "../../repositories/gains";
import expenses from "../../repositories/expenses";
import listOfMonths from '../../utils/months';

import { Container, Content } from "./styles";

interface IData{
    description: string;
    amount: string;
    frequency: string;
    date: string;
}

const Dashboard: React.FC = () => {
    const [ monthSelected, setMonthSelected ] = useState(new Date().getMonth()+1);
    const [ yearSelected, setYearSelected ] = useState(new Date().getFullYear());

    const months = useMemo (() => {
        return listOfMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month,
            }
        });
    },[])

    const years = useMemo (() => {
        let uniqueYears: number[] = [];

        [...expenses, ...gains].forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();

            if(!uniqueYears.includes(year)){
                uniqueYears.push(year);
            }
        });

        if (!uniqueYears.includes(yearSelected)){
            setYearSelected(Math.max(...uniqueYears));
        }

        return uniqueYears.map(year => {
            return {
                value: year,
                label: year,
            }
        })
    },[yearSelected]);
        
    const totalAmount = (data: IData[], selectedMonth: Number, selectedYear: Number) => {
        let total: number = 0;

        for (const item of data) {
            const date = new Date(item.date);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            if( month === selectedMonth && year === selectedYear )
                total += Number(item.amount);

        
        }
        return total
    }

    const totalExpenses = useMemo(() => {
        return totalAmount(expenses, monthSelected, yearSelected)
    },[monthSelected, yearSelected]);

    const totalGains = useMemo(() => {
        return totalAmount(gains, monthSelected, yearSelected)
    },[monthSelected, yearSelected]);

    const monthBalance = useMemo(() => totalGains - totalExpenses,[totalGains, totalExpenses]);

    const message = useMemo(() => {
        if (monthBalance < 0) {
            return {
                title: 'Que triste!',
                description: 'Neste mês, você gastou mais do que deveria.',
                footerText: 'Verifique seus gastos e tente cortar algumas coisas desnecessárias.',
                icon: sadImg
            }
        }else if ( monthBalance === 0 ){
            return {
                title: 'Ufaa!',
                description: 'Neste mês, você gastou exatamente o que ganhou.',
                footerText: 'Tenha cuidado. No próximo tente poupar o seu dinheiro.',
                icon: grinningImg
            }
        }else {
            return {
                title: 'Muito bem!',
                description: 'Sua carteira está positiva.',
                footerText: 'Continue assim. Considere investir o seu saldo.',
                icon: happyImg
            }  
        }

    }, [monthBalance]);

    const relationExpensesVersusGains = useMemo(() => {
        const total = totalGains + totalExpenses;

        const gainsPercent = total > 0 ? (totalGains / total) * 100 : 0;
        const expensesPercent = total > 0 ? (totalExpenses / total) * 100 : 0;

        const data = [
            {
                name: "Entradas",
                value: totalGains,
                percent: Number(gainsPercent.toFixed(1)),
                color: "#F7931B"
            },
            {
                name: "Saídas",
                value: totalExpenses,
                percent: Number(expensesPercent.toFixed(1)),
                color: "#E44C4E"
            }
        ];

        return data;

    }, [totalGains,totalExpenses]);


    const historyData = useMemo(() => {
        return listOfMonths.map((_, month) => {
            let amountGains = 0;
            for(const gain of gains){
                const date  = new Date(gain.date);
                const gainMonth = date.getMonth();
                const gainYear = date.getFullYear();

                if (gainMonth === month && gainYear === yearSelected){
                    try{
                        amountGains += Number(gain.amount);
                    }catch{
                        throw new Error(`Amount in Gains Database is invalid. 
                        Amount must be a valid number. Value: ${gain.amount}`)
                    }
                }
            }

            let amountExpenses = 0;
            for(const expense of expenses){
                const date  = new Date(expense.date);
                const expenseMonth = date.getMonth();
                const expenseYear = date.getFullYear();

                if (expenseMonth === month && expenseYear === yearSelected){
                    try{
                        amountExpenses += Number(expense.amount);
                    }catch{
                        throw new Error(`Amount in Expenses Database is invalid. 
                        Amount must be a valid number. Value: ${expense.amount}`)
                    }
                }
            }

            return {
                monthNumber: month,
                month: listOfMonths[month].substring(0,3),
                amountGains,
                amountExpenses
            }
        })
        .filter(item => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            return (
                yearSelected === currentYear 
                && item.monthNumber <= currentMonth)
                || (yearSelected < currentYear)
        });
    }, [yearSelected]);

    const handleMonthSelected = (month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        } catch{
            throw new Error('invalid month value')
        }
    }

    const handleYearSelected = (year: string) => {
        try {
            const parseYear = Number(year);
            setYearSelected(parseYear);
        } catch {
            throw new Error('invalid year value')
        }
    }


    return (
        <Container>
            <ContentHeader title="Dashboard" lineColor="#F7931B">
                <SelectInput options={months} onChange={(e) => handleMonthSelected(e.target.value)} defaultValue={monthSelected}/>
                <SelectInput options={years} onChange={(e) => handleYearSelected(e.target.value)} defaultValue={yearSelected}/>
            </ContentHeader>
        
            <Content>
                <WalletBox 
                    title="saldo"
                    color="#4E41F0"
                    amount={monthBalance}
                    footerLabel="atualizado com base nas entradas e saídas"
                    icon="dollar"
                />
                <WalletBox 
                    title="Entradas"
                    color="#F7931B"
                    amount={totalGains}
                    footerLabel="atualizado com base nas entradas e saídas"
                    icon="arrowUp"
                />
                <WalletBox 
                    title="Saídas"
                    color="#E44C4E"
                    amount={totalExpenses}
                    footerLabel="atualizado com base nas entradas e saídas"
                    icon="arrowDown"
                />

                <MessageBox 
                    title={message.title}
                    description={message.description}
                    footerText={message.footerText}
                    icon={message.icon}
                />

                <PieChartBox data={relationExpensesVersusGains}/>
                
                <HistoryBox 
                    data={historyData}
                    lineColorAmountGains="#F7931B"
                    lineColorAmountExpenses="#E44C4E"
                />
            </Content>
        </Container>
    );
}

export default Dashboard;