import React, { useEffect, useState } from 'react';
import { Box, Dialog, Grid, Switch, FormGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
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


export default function UnitEditDialog({ devnickname, code, ownedunits, userlist }: UnitEditDialogProps) {
    const [open, setOpen] = useState(false);
    const [unitOwned, setUnitOwned] = useState(false);
    
    const [abiOneLevel, setAbiOneLevel] = useState(0); //number
    const [abilities, setAbilities] = useState<number[]>([]); //number[]
    
    const handleAbiOneChange = (
        event: React.MouseEvent<HTMLElement>,
        newAbility: number[],
      ) => {
        if (newAbility.length > 0) {
          const clickedNumber = newAbility[newAbility.length - 1];
          const clickedLevel = Number(event.currentTarget.getAttribute('value'));
          let updatedAbilities;
          
          // Determine whether to add or remove abilities
          if (newAbility[newAbility.length - 1] > Math.max(...abilities, -1)) {
            // Add abilities up to the clicked number
            updatedAbilities = Array.from({ length: clickedNumber + 1 }, (_, i) => i);
            setAbilities(updatedAbilities);
          } else {
            // Remove abilities after the clicked number
            // updatedAbilities = abilities.filter(num => num <= clickedNumber);
            if(clickedLevel ===5) {
                setAbilities([]);
                return;
            }


            console.log("clicked number: ", clickedLevel);
            const abilityLevel = [];
            for (let i = 0; i <= clickedLevel; i++) {
              abilityLevel.push(i);
            }

            console.log("Ability Level: ", abilityLevel);
            setAbilities(abilityLevel);
          }
          
          
        } else {
          setAbilities([]);
        }
      };
    

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
            maxWidth={false}
        >
            <Box style={{
                padding: '20px',
                width: '50vw',
                maxWidth: '820px',
                margin: '0 auto'
            }}>
                <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Grid item style={{ margin: '10px' }}>
                        <img src={`https://eliya-bot.herokuapp.com/img/assets/chars/${devnickname}/square_0.png`} alt={devnickname} style={{ width: '100px' }} />
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

                <ToggleButtonGroup
                    value={abilities}
                    onChange={handleAbiOneChange}
                >
                    {Array.from(Array(6), (_, index) => (
                        <ToggleButton
                            key={index}
                            value={index}
                            aria-label={`ability-${index}`}
                            style={{ width: '50px', height: '50px' }}
                            // disabled={index < abiOneLevel}
                            // onChange={handleAbiOneChange}
                        >
                            {index}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>
        </Dialog>
    </div>
);
}
