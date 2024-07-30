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
import Button from '@mui/material/Button';
// import { Save } from "@mui/icons-material";

const Save = require('../save');

export default function Inventory(props:any) {
    
    const getCategories = () => {
        const result: any[] = [];
        for (const key in items) {
            const item = items[key];
            if (!result.includes(item[5])) {
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
            result.push(items[key]);
        }
        return result;
    }

    const GetIDFromName = (name:string) => {
        for (const key in items) {
            if (items[key][0] === name) {
                console.log(name + ":" + key);
                return key;
            }
        }
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

    const handleMaxAllItems = () => {
        const allItems = makeListOfAllItems();
        for (const item of allItems) {
            const id = GetIDFromName(item[0]);
            Save.setItemQuantity(id, item[17], props.fileContent);
        }
        setResult(makeListOfAllItems()); // Refresh the result list
    };

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
            <Button variant="contained"
            onClick={handleMaxAllItems}
            >
                Max all items
            </Button>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '60px 0',
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
                        <div key={GetIDFromName(item[0])}>
                            <ItemDialog cap={item[17]} id={GetIDFromName(item[0])} name={item[1]} fileContent={props.fileContent} setFileContent={props.setFileContent} devnickname={item[0]} src={"https://wfjukebox.b-cdn.net/big"+item[2]+".png"} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
