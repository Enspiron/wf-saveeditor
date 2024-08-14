"use client";
import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { devNameToCharacterId, devNameToEquipmentId, equipmentIdToDevName, characterIdToDevName, getParties } from '../save';

import EmptyEquipment from './empty_equipment.png';
import EmptyCharacter from './empty_character.png';
import EmptySoul from './empty_soul.png'
import ColorSetting from './color_setting.png'
import { TextField } from '@mui/material';
import { Margin } from '@mui/icons-material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const colorData = require('./party_group_color.json');

const character_id = require('../character.json');
const equipment_id = require('../equipment.json');

interface CharacterId {
    [key: string]: string[];
}

const characterId: CharacterId = character_id as unknown as CharacterId;

interface Character {
    devnickname: string;
    id: string;
    code: string;
}

const makeCharacterList = (): Character[] => {
    return Object.keys(characterId).map(key => ({
        devnickname: characterId[key]?.[0] || '',
        id: key,
        code: key
    }));
};

const makeEquipmentList = (): any => {
    const equipmentList:any = []
  
    Object.keys(equipment_id).forEach(key => {
    //   equipmentList[equipment_id[key][0]] = key;
        equipmentList.push({
            devnickname: equipment_id[key]?.[0] || '',
            id: key,
            code: key
    });
    });
  
    return equipmentList;
  };

const characterList = makeCharacterList();

interface Unit {
    name?: string;
    // Add other properties if needed
}

interface Team {
    list: Record<string, Unit>; // Assuming list is an object with string keys
    color_id: number;
    // Add other properties if needed
}

interface TeamOptions {
    allow_other_players_to_heal_me: boolean;
  }
  
  interface TeamObject {
    name: string;
    character_ids: any;
    unison_character_ids: any;
    equipment_ids: any;
    ability_soul_ids: any;
    edited: boolean;
    options: TeamOptions;
  }

  function cleanName(name: string): string {
    // Remove prefix like 'decay-' from the name
    return name.replace(/^[^-]+-/, '');
}
  
function parseTeamURL(url: string): TeamObject {
    // Extract the relevant part of the URL
    let match = url.match(/comp\/([^@]+)(?:@|$)/);
    if (!match) {
        throw new Error('Invalid URL format');
    }

    //remove png from end of url
    // match = match[1].match(/(.*).png/);

    console.log("Match: ", match);
    // Split components by '-'
    if(match) {

        const components = match[1].split('-');
        console.log("Components: ", components);
    

    // Extract and clean names
    let characterNames:any = components.slice(0, 6); // First six are characters and unisons
    const equipsAndSouls = components.slice(6); // Remaining are equipment and souls

    // Handle "blank" and unwanted prefix
    characterNames = characterNames.map((name: string) => name === 'blank' ? null : name.replace("bot.herokuapp.com/comp/", ""));
    console.log("Characters: ", characterNames);

    // Handle special cases for equipment names
    let equips = equipsAndSouls.slice(0, 6);
    equips[5] = equips[5].replace("@", ""); // Remove '@' from the last equip

    // Separate mains and unisons
    const main = characterNames.filter((_: any, index: number) => index % 2 === 0);
    const unison = characterNames.filter((_: any, index: number) => index % 2 !== 0);
    console.log("Main: ", main);
    console.log("Unison: ", unison);

    // Separate equipment and souls
    const equipment = equips.filter((_, index) => index % 2 === 0);
    const souls = equips.filter((_, index) => index % 2 !== 0);
    //check if soul has .png at end if does remove it

    console.log("Equipment: ", equipment);
    console.log("Souls: ", souls);

    // Convert names to IDs, handling 'N/A' case
    const character_ids = [
        devNameToCharacterId(main[0] === 'N/A' ? 'N/A' : main[0]), // Character 1
        devNameToCharacterId(main[1] === 'N/A' ? 'N/A' : main[1]), // Unison 1 as Character 2
        devNameToCharacterId(main[2] === 'N/A' ? 'N/A' : main[2]), // Character 3 as Character 2
    ];

    const unison_character_ids = [
        devNameToCharacterId(unison[0] === 'N/A' ? 'N/A' : unison[0]), // Unison 2
        devNameToCharacterId(unison[1] === 'N/A' ? 'N/A' : unison[1]), // Unison 2
        devNameToCharacterId(unison[2] === 'N/A' ? 'N/A' : unison[2]), // Unison 3
    ];

    const equipment_ids = equipment.map(name => devNameToEquipmentId(cleanName(name)) || 'N/A');
    const ability_soul_ids = souls.map(name => devNameToEquipmentId(cleanName(name)) || 'N/A');
    const edited = true;
    const options: TeamOptions = { allow_other_players_to_heal_me: true };
    return {
        name: characterNames[0] || '', // Assuming team name is derived from the first character name
        character_ids,
        unison_character_ids,
        equipment_ids,
        ability_soul_ids,
        edited,
        options,
    };
    } else {
        throw new Error('Invalid URL format');
    }
}





function TeamLayout({ team }: { team: any }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    


    const [selectedIndex , setSelectedIndex] = React.useState(0);

    const [type, setType] = React.useState(null);
    function UnitPopup(props:any) {

        return (
            <Dialog 
                open={open} 
                onClose={handleClose}
                PaperProps={{
                    style: {
                        width: '80%',  // Adjust the width as needed
                        maxWidth: 'none' // Ensure it doesn't get constrained
                    }
                }}
            >
                <DialogTitle>Select Replacement</DialogTitle>
                <DialogContent>
                    {type === ('character') || type === 'unison' ? (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
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
                                {characterList.map(character => (
                                    <div key={character.id}>
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
                                                transition: 'all 0.3s cubic',
                                                cursor: 'pointer',
                                            }}
                                            src={`https://eliya-bot.herokuapp.com/img/assets/chars/${character.devnickname}/square_0.png`}
                                            onClick={()=>{
                                                console.log('Character clicked:', character);
                                                //set character id to selected character
                                                type === 'character' ? team.character_ids[props.selected] = parseInt(character.id) : team.unison_character_ids[props.selected] = parseInt(character.id);
                                                handleClose();
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div 
                                style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
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
                                {makeEquipmentList().map((equip:any) => (
                                    // https://wfjukebox.b-cdn.net/equipment/${equip.devnickname}.png
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
                                                transition: 'all 0.3s cubic',
                                                cursor: 'pointer',
                                            }}
                                            src={`https://eliya-bot.herokuapp.com/img/assets/item/equipment/${equip.devnickname}.png`}
                                            onClick={()=>{
                                                console.log('Character clicked:', equip);
                                                //set equip id to selected equp depending on soul or equipment
                                                type === 'equipment' ? team.equipment_ids[props.selected] = parseInt(equip.id) : team.ability_soul_ids[props.selected] = parseInt(equip.id);
                                                
                                                handleClose();
                                            }}
                                        />
                                ))}

                            </div>
                            </div>
                        </div>
                    )}
                </DialogContent>

            </Dialog>
        );
    
    }


    const getImageSource = (type: string, id: any) => {
        // `https://eliya-bot.herokuapp.com/img/assets/chars/${gecharacterIdToDevName(id)}/square_0.png`
        // https://eliya-bot.herokuapp.com/img/assets/item/equipment/${equipmentIdToDevName(id)}.png
        //if character and unison N/A, show empty character
        if((type === 'character' || type=== 'unison') && (id === 'N/A' || id === -1)) {
            return EmptyCharacter.src;
        }

        //if type === soul and id === N/A, show empty soul
        if((type === 'soul') && (id === 'N/A' || id === -1)) {
            return EmptySoul.src;
        }

        

        //if equipment and soul N/A, show empty equipment
        if((type === 'equipment' || type === 'soul') && (id === 'N/A' || id === -1)) {
            return EmptyEquipment.src;
        }

        switch (type) {
            case 'character':
                return `https://eliya-bot.herokuapp.com/img/assets/chars/${characterIdToDevName(id)}/square_0.png`;
            case 'equipment':
                return `https://eliya-bot.herokuapp.com/img/assets/item/equipment/${equipmentIdToDevName(id)}.png`;
            case 'soul':
                return `https://wfjukebox.b-cdn.net/equipment/${equipmentIdToDevName(id)}_soul.png`;
            case 'unison':
                return `https://eliya-bot.herokuapp.com/img/assets/chars/${characterIdToDevName(id)}/square_0.png`;
            default:
                return '';
        }
    }

    // Helper function to render a button with the given text

    const getAlignmentStyles = (type: any) => {
        switch (type) {
            case 'equipment':
                return {
                    justifyContent: 'flex-start', // Align items to the left
                    // alignItems: 'flex-end', // Align items to the bottom
                    //put it at botton
                    // marginTop: '0',
                    //have it be vertically center
                    margin: 'auto',
                };
            case 'soul':
                return {
                    // justifyContent: 'flex-end', // Align items to the right
                    // alignItems: 'right', // Align items to the top
                    // margin: 'auto',
                    //make it in middle
                    justifyContent: 'center',
                    alignItems: 'center',
                    // width: '100%',
                    

                
                };
            case 'unison':
                return {
                    justifyContent: 'flex-start', // Align items to the left
                    alignItems: 'flex-start', // Align items to the top
                };
            default:
                return {
                    justifyContent: 'center', // Center items horizontally
                    alignItems: 'center', // Center items vertically
                };
        }
    };
    
    const alignmentStyles = getAlignmentStyles(type);

    //depending on type the width is different
    const renderButton = (text: string, type: any, index: number) => {
    const alignmentStyles = getAlignmentStyles(type);

    return (
        <Grid
            item
            xs={6}
            style={{
                // border: '1px solid black',
                display: 'flex',
                flexDirection: 'column',
                ...alignmentStyles,
                height: '100%', // Ensure grid item takes full height of the container
                width: '100%', // Ensure grid item takes full width of the container
                position: 'relative',
                // padding: '4px', // Add padding if needed
            }}
        >
            <Button
                variant="contained"
                
                style={{
                    width: type === 'equipment' || type === 'soul' ? '50%' : '110%',
                    // alignContent: 'center',
                    justifyContent: 'center',
                    // opacity: type === 'soul' ? 0.5 : 1,
                    backgroundColor:  'white',
                }}
                onClick={() => {
                    console.log('Button clicked:', text);
                    setType(type);
                    setSelectedIndex(index);
                    console.log('Selected Index:', selectedIndex);
                    handleOpen();
                }}
            >
                <img
                    src={getImageSource(type, text)}
                    style={{
                        width: '150%',
                        transform: type === 'soul' ? 'opacity(50%)' : 'none',
                        //filter it so it is gray
                        //if type != 'N/A' then filter it
                        filter: text === 'N/A' ? 'grayscale(100%)' : 'none',
                    }}
                    alt={text}
                />
            </Button>
        </Grid>
    );
};

    

    // Render columns with 2x2 grid layout
    const columns = [0, 1, 2].map(index => (
        <Grid item xs={4} key={index}>
            <Grid container spacing={2}>
                {renderButton(team.character_ids[index] || 'N/A', 'character', index)}
                {renderButton(team.equipment_ids[index] || 'N/A', 'equipment', index)}
                {renderButton(team.ability_soul_ids[index] || 'N/A', 'soul', index)}
                {renderButton(team.unison_character_ids[index] || 'N/A', 'unison', index)}
            </Grid>
        </Grid>
    ));

    return (
        <div style={{ 
            padding: 16,
            backgroundColor: '#008394',
            borderRadius: 8,
            // border: '1px solid darkgray',
            marginTop: 16,

            }}>
            <Grid container spacing={2}

            >
                {columns}
                <UnitPopup selected={selectedIndex} />
            </Grid>
        </div>
    );
}

export default function TeamSetting(props: any) {
    const [fileContent, setFileContent] = React.useState(props.fileContent);

    const TeamGroups: { [key: string]: Team } = getParties(fileContent);

    console.log('TeamGroups:', TeamGroups);
    console.log('Type of TeamGroups:', typeof TeamGroups);

    const teamsArray = Object.entries(TeamGroups);
    const maxUnits = Math.max(...teamsArray.map(([_, team]) => Object.keys(team.list).length));

    const [open, setOpen] = React.useState(false);
    const [selectedUnit, setSelectedUnit] = React.useState<Unit | null>(null);

    const [selectedTeam, setSelectedTeam] = React.useState<any | null>(null);

    const [openColor, setOpenColor] = React.useState(false);
    const handleOpenColor = () => setOpenColor(true);
    const handleCloseColor = () => setOpenColor(false);

    const [selectedGroup, setSelectedGroup] = React.useState<any | null>(null);

    const handleOpen = (unit: Unit) => {
        setSelectedUnit(unit);
        console.log('Team clicked:', unit);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUnit(null);
    };

    const urlRef = useRef<HTMLInputElement>(null);

    function getColorCode(input: number): string | undefined {
        // Convert input to string to match the keys in the colorData object
        const key = input.toString();
        
        // Check if the key exists in the colorData object
        if (colorData[key]) {
            // Get the hex color code (second element of the array)
            const hexColorCode = colorData[key][1];
            
            // Remove the "0x" prefix and return the remaining part
            return hexColorCode.replace(/^0x/, '');
        } else {
            // Return undefined if the key does not exist
            return undefined;
        }
    }

    // const color_id = team.color_id;
    const gridSize = 5; // Change this if you want a different number of columns

    return (
        <div style={{ padding: 16,
            //center
            justifyContent: 'center',
            alignItems: 'center',
            

         }}>
            
        <TableContainer component={Paper}>
            <Table>
                {/* Table Header Row */}
                <TableHead>
                    <TableRow>
                        {teamsArray.map(([teamId, team], teamIndex) => (
                            <TableCell
                                key={teamId}
                                style={{
                                    // border: `2px solid #${getColorCode(team.color_id)}`,
                                    backgroundColor: `#${getColorCode(team.color_id)}`,
                                }}
                                onClick={()=>{
                                    handleOpenColor();
                                    setSelectedGroup(teamIndex);
                                }}
                                
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ width: '100%' }}
                                    onClick={() => console.log('Team clicked:', team)}
                                    //endicon
                                    endIcon={<img src={ColorSetting.src} style={{width: '30px'}} />}
                                >
                                    Group {teamIndex + 1}
                                </Button>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {/* Table Body Rows */}
                <TableBody>
                    {Array.from({ length: maxUnits }).map((_, unitIndex) => (
                        <TableRow key={unitIndex}>
                            {teamsArray.map(([teamId, team], teamIndex) => {
                                const unit = Object.values(team.list)[unitIndex];
                                return (
                                    <TableCell key={teamId}>
                                        {unit ? (
                                            <Button
                                                variant="outlined"
                                                style={{ width: '100%' }}
                                                onClick={() => {
                                                    handleOpen(unit);
                                                    setSelectedTeam(unit);
                                                }}
                                            >
                                                {unit.name || 'No Name'}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                disabled
                                                style={{ width: '100%' }}
                                            >
                                                No Unit
                                            </Button>
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
            <Dialog open={openColor} onClose={handleCloseColor}>
                <DialogTitle>Change Team Color / Group {selectedGroup+1}</DialogTitle>
                <DialogContent>
                <div style={{ 
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: '4px',
                padding: '10px'
            }}>
                {/* Map the colors */}
                {Object.keys(colorData).map((colorID, index) => {
                    // Get the color code without "0x"
                    const colorCode = colorData[colorID][1].replace(/^0x/, '');
                    
                    return (
                        <div 
                            key={colorID} 
                            style={{ 
                                // width: '50px', 
                                // height: '100%', 
                                // backgroundColor: `#${colorCode}`, 
                                // border: '1px solid #000',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff', // Text color for visibility
                                textAlign: 'center',
                                lineHeight: '50px', // Center text vertically
                                padding: '0 4px', // Add padding for better appearance

                            }}>
                            {/* Optional: Display color code */}
                            <Button
                            variant="contained"
                            style={{
                                backgroundColor: `#${colorCode}`,
                                // color: '#fff',
                                // width: '100%',
                                borderRadius: '8px',
                                padding: '0 4px',
                                textAlign: 'center',
                                lineHeight: '50px',
                            }}
                            onClick={()=>{
                                // console.log('Color clicked:', colorID);
                                //set color id to selected color
                                // team.color_id = parseInt(colorID);
                                console.log('Selected Team:', teamsArray);
                                //set the color id of the selected group
                                teamsArray[selectedGroup][1].color_id = parseInt(colorID);

                                handleCloseColor();
                            }}
                            >
                                {colorID}
                            </Button>
                        </div>
                    );
                })}
            </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Team  Details */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Team Details
                </DialogTitle>
                <DialogContent>
                    {selectedUnit ? (
                        <Typography >
                            Current Team <TextField inputRef={urlRef} size="small" variant="outlined"  label="Import From Eliya" 
                            style={{
                                width: '50%',
                                marginBottom: '10px',
                                marginTop: '10px',
                            }}
                            />
                            <Button variant="outlined"
                            onClick={()=>{
                                console.log('URL:', urlRef.current?.value);
                                const url:any = urlRef.current?.value;
                                if(true) {
                                    try {
                                        console.log('Parsing team...');
                                        const team = parseTeamURL(url);
                                        console.log('Parsed Team:', team);
                                        setSelectedTeam(team);
                                        setSelectedUnit(team);
                                    } catch (error) {
                                        console.error('Error parsing team:', error);
                                    }
                                }
                            }}
                            style={{
                                marginBottom: '10px',
                                marginTop: '10px',
                                marginLeft: '10px',
                            }}
                            >Import</Button>
                            <TeamLayout team={selectedUnit} />
                        </Typography>
                    ) : (
                        <Typography variant="body1">No unit selected</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>Close</Button>
                    <Button variant="contained" onClick={handleClose}>Save</Button>
                </DialogActions>   
            </Dialog>
        </div>
    );
}
