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

    // console.log("Owned Units: ", props.ownedunits)
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
            <img 
            style={{
                display: 'flex',
                width: '56px',
                height: '56px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '3px',
                margin: '2px',
                border: '3px solid #000',
                boxShadow: '0 0 1px 1px 0 #000',
                backgroundColor: isUnitOwned() ? '#FFF' : '#000',
                filter: isUnitOwned() ? 'none' : 'brightness(50%)'
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
                    {props.code}
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
