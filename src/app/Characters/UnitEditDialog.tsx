import React from 'react';
import { Box, Button, Divider, Typography, ToggleButton, ToggleButtonGroup, Dialog } from '@mui/material';
import Grid from '@mui/material/Grid';

interface UnitEditDialogProps {
    devnickname: string;
    characterId: string;
}

export default function UnitEditDialog(props: any) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    console.log("Owned Units: ", props.ownedunits)
    const owned_chars = props.ownedunits;
    const isUnitOwned = () => {
        // console.log("checking if owned units is correct, ", props.ownedunits);
        for(let key in owned_chars) {
            // console.log("checking owned unit ", key);
            if(key === props.devnickname) {
                // console.log("owned", key, props.devnickname);
                return true;
            }
        }
        return false; // Move this line outside of the for loop
    }

    return (
        <div>
            <img width='50'
            style={{
                border: '2px solid grey',
                // padding: '5px',
                margin: '5px',
                ...(isUnitOwned() ? { transform: 'none' } : { filter: 'brightness(50%)' })
            }}
                src={`https://eliya-bot.herokuapp.com/img/assets/chars/${props.devnickname}/square_0.png`} 
                alt={props.devnickname}
                onClick={handleOpen} 
            />
            <Dialog open={open} onClose={handleClose}>
                    <Box
                    style={{
                        padding: '20px',
                    }}
                    >
                    <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Grid item>
                    {props.devnickname}
                    </Grid>
                    <Grid item>
                    {isUnitOwned() ? "Owned" : "Not Owned"}
                    </Grid>
                    </Grid>

                    </Box>
                </Dialog>
        </div>
    );
}
