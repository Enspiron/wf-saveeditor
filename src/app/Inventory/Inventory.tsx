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
        {name: "Training Items", id: 0},
        {name: "Items used for armament augmentation", id: 1},
        {name: "Event Items", id: 9},
        {name: "Trading Items", id: 15},
        {name: "Ticket", id: 8},
        {name: "Ability Core", id: 11},
        {name: "Wrightpiece", id: 16},
        {name: "Star Speck", id: 20},
    ];

    const [expanded, setExpanded] = React.useState<string | false>('panel1');

    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

    const GetAllItemsWithCategoryID = (id:number): any[] => {
        const result = [];
        for (const key in items) {
            const item = items[key];
            // console.log("checking if ", item[5], " is equal to ", id);
            if (parseInt(item[5]) === id) {
                result.push((items[key]));
            }
        }
        // console.log(JSON.stringify(result));
        return result;
    }

    const GetIDFromName = (name:string) => {
        for (const key in items) {
            if (items[key].name === name) {
                return items[key].id;
            }
        }
    }



    return (
        <div>
            {categories.map((category) => (
                <Accordion
                    key={category.id}
                    expanded={expanded === `panel${category.id}`}
                    onChange={handleChange(`panel${category.id}`)}
                >
                    <AccordionSummary>
                        <Typography>{category.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            {GetAllItemsWithCategoryID(category.id).map((item) => (
                                <div key={item.id}>
                                    <img 
                       
                       src={`https://wfjukebox.b-cdn.net/big${item[2]}.png`} 
                       // alt={item[0]} 
                       style={{ 
                           height: '40px',
                           // width: '40px',
                           cursor: 'pointer', 
                           // border: '1px solid black',
                           // padding: '5px',

                       }} 
                    //    onClick={() => handleClickOpen(item)}
                   />
                                </div>
                            ))}
                        </div>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );

}