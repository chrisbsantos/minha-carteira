import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import ContentHeader from "../../components/ContentHeader";
import SelectInput from "../../components/SelectInput";
import HistoryFinanceCard from "../../components/HistoryFinanceCard";

import gains from "../../repositories/gains";
import expenses from "../../repositories/expenses";
import { formatCurrency, formatDate } from '../../utils/helpers';
import listOfMonths from '../../utils/months';

import { Container, Content, Filters } from "./styles";

interface IData{
    id: string;
    description: string;
    amountFormatted: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;
}

const List: React.FC = () => {
    const [ data, setData ] = useState<IData[]>([]);
    const [ monthSelected, setMonthSelected ] = useState(new Date().getMonth()+1);
    const [ yearSelected, setYearSelected ] = useState(new Date().getFullYear());
    const [ selectedFrequency, setSelectedFrequency ] = useState(['recorrente','eventual']);


    let { type: movimentType } = useParams();
       
    const pageData = useMemo(() => {
        return movimentType === 'entry-balance' ?
        {
            title: 'Entradas',
            lineColor: '#4E41F0',
            data: gains,
        }
        :
        {
            title: 'Saídas',
            lineColor: '#E44C4E',
            data: expenses,
        }
    },[movimentType])


    const months = useMemo (() => {
        return listOfMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month,
            }
        });
    },[])

    const years = useMemo (() => {
        let uniqueYears: number[] = []

        pageData.data.forEach(item => {
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
    },[pageData.data, yearSelected]);

    const handleFrequencyClick = (frequency: string) => {
        const alreadySelected = selectedFrequency.findIndex(item => item === frequency);

        if (alreadySelected >= 0){
            const filtered = selectedFrequency.filter(item => item !== frequency);
            setSelectedFrequency(filtered);
        }else{
            setSelectedFrequency((prev) => [...prev,frequency]);
        }
    }

    const handleMonthSelected = (month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        } catch {
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

    useEffect (() => {
        const filteredData = pageData.data.filter(item => {
            const date = new Date(item.date);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return month === monthSelected && year === yearSelected && selectedFrequency.includes(item.frequency);
        });

        const formattedData = filteredData.map((item) => {
            return {
                id: uuidv4(),
                description: item.description,
                amountFormatted: formatCurrency(Number(item.amount)),
                frequency: item.frequency,
                dateFormatted: formatDate(item.date),
                tagColor:  item.frequency === 'recorrente' ? '#4E41F0' : '#E44C4E'
            }
        });

        setData(formattedData)
    },[pageData.data, monthSelected, yearSelected, selectedFrequency]);

    return (
        <Container>
            <ContentHeader title={pageData.title} lineColor={pageData.lineColor}>
                <SelectInput options={months} onChange={(e) => handleMonthSelected(e.target.value)} defaultValue={monthSelected}/>
                <SelectInput options={years} onChange={(e) => handleYearSelected(e.target.value)} defaultValue={yearSelected}/>
            </ContentHeader>

            <Filters>
                <button 
                    type="button"
                    className={`tag-filter tag-filter-recurrent
                    ${selectedFrequency.includes('recorrente') && 'tag-activated'}`}
                    onClick={() => handleFrequencyClick('recorrente')}
                >Recorrentes</button>
                <button 
                    type="button"
                    className={`tag-filter tag-filter-eventual
                    ${selectedFrequency.includes('eventual') && 'tag-activated'}`}
                    onClick={() => handleFrequencyClick('eventual')}
                    >Eventuais</button>
            </Filters>

            <Content>
                {
                    data.map(item => (
                            <HistoryFinanceCard 
                            key={item.id}
                            tagColor={item.tagColor}
                            title={item.description}
                            subtitle={item.dateFormatted}
                            amount={item.amountFormatted}
                        />
                        ))
                }
            </Content>
        </Container>
    );
}

export default List;