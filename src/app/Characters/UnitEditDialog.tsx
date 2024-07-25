import React, { useEffect, useState } from 'react';
import { Box, Dialog, Grid, Switch, FormGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

const Save = require('../save');

interface UnitEditDialogProps {
  devnickname: string;
  characterId: string;
  code: string;
  ownedunits: Record<string, string>;
  userlist: {
    data: {
      user_character_list: Record<string, any>;
    };
  };
}

export default function UnitEditDialog({ devnickname, code, ownedunits, userlist }: UnitEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [unitOwned, setUnitOwned] = useState(false);

  useEffect(() => {
    setUnitOwned(devnickname in ownedunits);
  }, [devnickname, ownedunits]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Unit Change: ", e.target.checked);
    if (e.target.checked) {
      try {
        console.log("Adding character: ", code, userlist);
        Save.addCharacter(code, userlist);
        setUnitOwned(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      // Logic for removing the character can be added here if needed
      setUnitOwned(false);
    }
  };

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
          boxShadow: '0 0 1px 1px #000',
          backgroundColor: unitOwned ? '#FFF' : '#000',
          filter: unitOwned ? 'none' : 'brightness(50%)'
        }}
        src={`https://eliya-bot.herokuapp.com/img/assets/chars/${devnickname}/square_0.png`}
        alt={devnickname}
        onClick={handleOpen}
      />
      <Dialog open={open} onClose={handleClose}>
        <Box style={{ padding: '20px' }}>
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item>
              <FormControl component="fieldset">
                <FormLabel component="legend">Add Character</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={unitOwned} onChange={handleUnitChange} name="owned" />}
                    label="Owned"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item>{devnickname}</Grid>
            <Grid item>{code}</Grid>
            <Grid item>{unitOwned ? "Owned" : "Not Owned"}</Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}
