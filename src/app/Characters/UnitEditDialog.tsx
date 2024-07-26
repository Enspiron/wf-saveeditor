import React, { useEffect, useState } from 'react';
import { Box, Dialog, Grid, Switch, FormGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import Slider from '@mui/material/Slider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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

function createData(
    name: string,
    level: number,
) {
    return { name, level };

}

const rows = [
    createData('Ability 1', 1),
    createData('Ability 2', 1),
    createData('Ability 3', 1),
    createData('Ability 4', 1),
    createData('Ability 5', 1),
    createData('Ability 6', 1),
]

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

//   export function editManaboard(characterID: number, ability: Ability, save: Save): void {


  Save.editManaboard(code, {
    "id" : "abi2",
    "level" : 1
  }, userlist);

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
            backgroundColor: unitOwned ? '#FFF' : '#000',
            filter: unitOwned ? 'none' : 'brightness(50%)'
        }}
        src={`https://eliya-bot.herokuapp.com/img/assets/chars/${devnickname}/square_0.png`}
        alt={devnickname}
        onClick={handleOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        // fullWidth
        maxWidth={false}
      >
        <Box style={{
          padding: '20px',
          width: '50vw', // Set the width to 90% of the viewport width
          maxWidth: '820px', // Optional: set a max width
          margin: '0 auto' // Center the dialog horizontally
        }}>
        <Grid container direction="row" justifyContent="center" alignItems="center">
        <Grid item style={{margin: '10px'}}>
            <img src={`https://eliya-bot.herokuapp.com/img/assets/chars/${devnickname}/square_0.png`} alt={devnickname} />
        </Grid>
        <Grid item>
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
            <Grid item>char devname: {devnickname}</Grid>
            <Grid item>Char id: {code}</Grid>
            </Grid>
        </Grid>
        </Grid>


          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ability</TableCell>
                  <TableCell>Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row" style={{width: '15%'}}>
                      {row.name}
                    </TableCell>
                    <TableCell>
                      <Slider
                        defaultValue={row.level}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={0}
                        max={5}
                        disabled
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Dialog>
    </div>
  );
}
