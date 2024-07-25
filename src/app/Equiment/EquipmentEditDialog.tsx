import React from 'react';
import { Box, Button, Divider, Typography, ToggleButton, ToggleButtonGroup, Dialog } from '@mui/material';
import Grid from '@mui/material/Grid';


export default function EquipmentEditDialog(props:any) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const ownedEquips = props.ownedequips;
    const isEquipOwned = () => {
        for (let key in ownedEquips) {
            if (ownedEquips[key] === props.equip_id) {
                return true;
            }
        }
    }

    return (
        <div

        >
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
                backgroundColor: isEquipOwned() ? '#FFF' : '#000',
                filter: isEquipOwned() ? 'none' : 'brightness(50%)'
            }}
            src={`https://eliya-bot.herokuapp.com/img/assets/item/equipment/${props.devnickname}.png`} 
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
                     id: {props.equip_id}
                    </Grid>
                    <Grid item>
                    {isEquipOwned() ? "Owned" : "Not Owned"}
                    </Grid>
                    </Grid>

                    </Box>
                </Dialog>
        </div>
    );
}