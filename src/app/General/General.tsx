import React, { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';

// Import the image
import Beads from './stone_large.png';
import Profile from './Profile.png'
import EXP from './pool_exp.png'
import Mana from './mana.png'

const Save = require('../save');



function MakeInput(
    name: string,
    image: any,
    value: any,
    set: (value: any) => void,
    inputType: string
) {
    return { name, image, value, set, inputType };
}

export default function General(props: any) {
    


    const save = props.fileContent;

    const inputs = [
        MakeInput("Name", Profile, Save.getName(save), (value: any) => Save.setName(value, save), "string"),
        MakeInput("Rank", Profile, Save.getRankPoint(save), (value: any) => Save.setRankPoint(value, save), "number"),
        MakeInput("Comment", Profile, Save.getComment(save), (value: any) => Save.setComment(value, save), "string"),
        MakeInput("Beads", Beads, Save.getVmoney(save), (value: any) => Save.setVmoney(value, save), "number"),
        MakeInput("EXP", EXP, Save.getExp(save), (value: any) => Save.setExp(value, save), "number"),
        MakeInput("Mana", Mana, Save.getMana(save), (value: any) => Save.setMana(value, save), "number"),
        
    ];

    const CustomInput = (props: any) => {
        const [edit, setEdit] = useState(false);
        const [value, setValue] = useState(props.value);

        const handleEditToggle = () => {
            if (edit) {
                props.set(value);
            }
            setEdit(!edit);
        };

        return (
            <FormControl variant="standard">
                <FormGroup row style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        type={props.inputType}
                        id={`input-${props.name}`}
                        label={`Edit ${props.name}`}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <img src={props.image.src} alt={props.name} style={{ width: 20 }} />
                                </InputAdornment>
                            ),
                            disabled: !edit,
                            style: {
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                marginRight: 0, // Ensures no gap on the right
                            },
                        }}
                        variant="outlined"
                        style={{
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            marginRight: 0, // Ensures no gap on the right
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleEditToggle}
                        style={{
                            height: '56px', // To match the TextField height
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            marginLeft: 0, // Ensures no gap on the left
                            padding: '8px 16px', // Adjust padding if necessary
                            boxShadow: 'none', // Remove the button's box shadow
                            textTransform: 'none', // Prevent the button from transforming the text
                        }}
                    >
                        {edit ? 'Save' : 'Edit'}
                    </Button>
                </FormGroup>
            </FormControl>
        );
    };

    return (
        <div>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                {inputs.map((input, index) => (
                    <CustomInput
                        key={index}
                        name={input.name}
                        image={input.image}
                        value={input.value}
                        set={input.set}
                        inputType={input.inputType}
                    />
                ))}
            </Box>
        </div>
    );
}
