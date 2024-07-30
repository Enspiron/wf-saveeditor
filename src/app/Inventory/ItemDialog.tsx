import React from 'react';
import { Box, Button, Divider, Typography, ToggleButton, ToggleButtonGroup, Dialog as MuiDialog } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function ItemDialog(props: any) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


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
  };

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
            <Grid item>
                {props.devnickname}
            </Grid>
            id: {props.id}
            </Grid>
            name: {props.name}
        </Box>
    </MuiDialog>
    </div>



  );
}
