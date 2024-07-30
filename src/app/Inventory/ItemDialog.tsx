import React from 'react';
import { Box, Button, Divider, Typography, ToggleButton, ToggleButtonGroup, Dialog as MuiDialog } from '@mui/material';
import TextField from '@mui/material';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';

const Save = require('../save');

export default function ItemDialog(props: any) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [itemAmount, setItemAmount] = React.useState(Save.getItemQuantity(props.id, props.fileContent));


  const containerStyle = {
    width: '40px', // Or your desired width
    height: '40px', // Or your desired height
    margin: '2px',
    border: '3px solid #000',
    boxShadow: '0 0 1px 1px 0 #000',
    padding: '2px',
    overflow: 'hidden', 
    display: 'flex', // Enable flexbox
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    // ...other existing styles (borderRadius, etc.)
  };

  const imageStyle = {
    maxWidth: '100%', 
    maxHeight: '100%', 
    display: 'block', 
    // if itemamount 0 then filter brightness 50%
    filter: itemAmount === 0 ? 'brightness(50%)' : 'none'
  };

  const setAmount = (itemAmount: number): void => {
    Save.setItemQuantity(props.id, itemAmount, props.fileContent);
    setItemAmount(itemAmount);
    }

    const itemRef = React.useRef<HTMLInputElement>(null);

  return (
    <div style={containerStyle}>
      <img 
        style={imageStyle} 
        src={props.src} 
        alt={props.devnickname} 
        onClick={handleOpen}
      />
    <MuiDialog open={open} onClose={handleClose}>
        <Box style={{ padding: '20px' }}>
            <Grid container direction="column" justifyContent="center" alignItems="center">
            </Grid>
            <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
            }}
            >
            {props.name}
            </div>
            <Grid item
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

            }}
            >
                <img src={props.src} alt={props.devnickname} style={{
                    width: '56px'
                }} />
            </Grid>
            <Grid item>
                <Input
                defaultValue={itemAmount}
                type="number"
                startAdornment={
                    <InputAdornment position="start">
                        <img src={props.src} alt={props.devnickname} style={{ width: '20px' }} />
                    </InputAdornment>
                }
                inputRef={itemRef}
                //max
                inputProps={{
                    min:0,
                    max:props.cap
                }}


                />
            </Grid>

            <Button
              variant="contained"
              onClick={() => setAmount(parseInt(itemRef.current?.value || '0'))}
              style={{
                marginTop: '10px',
                width: '100%',
              }}
            >
              Set Amount
            </Button>
            <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '5px',
            }}
            >
                Item ID: {props.id}
            </div>
        </Box>
    </MuiDialog>
    </div>



  );
}
