"use client"
const items = require('./item.json');
import React from "react";

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ItemDialog from "./ItemDialog";
import { get } from "http";
import TextField from '@mui/material/TextField';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    },
  }));
  
  const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, .05)'
        : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));
  
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }));

export default function Inventory(props:any) {
    const categories = [
        {name: "Consumables", id: 2},
        {name: "Weapons", id: 23},
        {name: "Alterites", id: 21},
        {name: "Astrals", id: 4},
        {name: "Astral Shards", id: 5},
        {name: "Ingots", id: 6},
        {name: "Ingot Shard", id: 7},
        {name: "Exchange Tickets", id: 12},
        {name: "More Suptix", id: 13},
        {name: "Encyclopedia Item", id: 18},
        {name: "Miscellaneous", id: 19},
        {name: "Training Items", id: 0},
        {name: "Items used for armament augmentation", id: 1},
        {name: "Event Items", id: 9},
        {name: "Trading Items", id: 15},
        {name: "Ticket", id: 8},
        {name: "Ability Core", id: 11},
        {name: "Wrightpiece", id: 16},
        {name: "Star Speck", id: 20},
    ];

    const getCategories = () => {
        const result: any[] = [];
        for (const key in items) {
            const item = items[key];
            if (!result.includes(item[5])) {
                //push {name: item[4], id: item[5]}
                result.push({name: item[4], id: item[5]});
            }
        }
        return result;
    }

    const [expanded, setExpanded] = React.useState<string | false>('');

    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };


    const makeListOfAllItems = () => {
        const result = [];
        for (const key in items) {
            // console.log((items[key][0]));
            result.push(items[key]);
        }
        return result;
    }

    const GetIDFromName = (name:string) => {
        for (const key in items) {
            if (items[key][0] === name) {
                //log name:id
                console.log(name + ":" + key);
                return key;
            }
        }
    }

    //print the list of categories
    for (const category of getCategories()) {
        // console.log(category);
    }

    const [result, setResult] = React.useState<any[]>(makeListOfAllItems());

    const handleSearch = (e:any) => {
        const search = e.target.value;
        const newResult = [];
        for (const key in items) {
            const item = items[key];
            if (item[1].toLowerCase().includes(search.toLowerCase())) {
                newResult.push(item);
            }
        }
        setResult(newResult);
    }

    return (
        <div>
            <TextField
                id="search"
                label="Search"
                onChange={handleSearch}
                style={{
                    width: '100%',
                    margin: '10px 0',
                }}
            ></TextField>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    // minHeight: '100vh',
                    padding: '10px 0',
                    
                }}
            >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(15, 1fr)',
                    boxSizing: 'border-box',
                    justifyContent: 'center',
                }}
                >
                {result.map((item) => (
                    <div>
                        <ItemDialog id={GetIDFromName(item[0])} name={item[1]} fileContent={props.fileContent} setFileContent={props.setFileContent} devnickname={item[0] } src={"https://wfjukebox.b-cdn.net/big"+item[2]+".png"} />
                    </div>
                ))}
            </div>
        </div>

            
        </div>
    );

}