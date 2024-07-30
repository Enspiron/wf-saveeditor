import React, { useState, useEffect } from 'react';
import { Box, Dialog } from '@mui/material';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';
import { styled as muistyles } from '@mui/material/styles';
import styled from 'styled-components';
const Save = require('../save');
import Button from '@mui/material/Button';

import EquipLevel from './EquipLevel';

const ConicImageWrapper = styled.div`
  position: relative;
  z-index: 0;
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  padding: 0.3rem;

  &::before {
    content: '';
    position: absolute;
    z-index: -2;
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    background-color: #f66fff;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(transparent, rgba(254, 240, 255, 1), transparent 30%);
    animation: rotate 0.75s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border-radius: 5px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(1turn);
    }
  }
`;

const ConicImageContent = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  margin: auto;
`;

const BadgeStyles = muistyles(Badge)({
  '& .MuiBadge-badge': {
    border: `2px solid #FFF`,
    backgroundColor: '#000',
    padding: '0 4px',
  },
});

export default function EquipmentEditDialog(props: any) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState(props.level);
  const [upgrade, setUpgrade] = useState(props.upgrade);
  
  useEffect(() => {
      setLevel(props.level);
    }, [props.level]);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const ownedEquips = props.ownedequips;
    const isEquipOwned = () => {
        for (let key in ownedEquips) {
            if (ownedEquips[key] === props.equip_id) {
                return true;
            }
        }
    };
    const [owned, setOwned] = useState(isEquipOwned());
    
  const isLV99 = () => {
    return level === 99;
  };

  const [animate, setAnimate] = useState(false);

  const urlFor99 = `https://wfjukebox.b-cdn.net/equipment/${props.devnickname}_enhanced99.png`;
  const urlForBase = `https://wfjukebox.b-cdn.net/equipment/${props.devnickname}.png`;

  const imageUrl = isLV99() ? urlFor99 : urlForBase;

  const handleSetLevel99 = () => {
    console.log('setting equip ', props.equip_id, ' to lv99');
    Save.setEquipEnhanceLevel(props.equip_id, 99, props.fileContent);
    setLevel(99);
  };

  const handleAddEquip = () => {
    console.log('adding equip ', props.equip_id);
    Save.addEquipment(props.equip_id, props.fileContent);
    setOwned(!owned);
}

return (
    <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 4, right: 19 }}>
            {props.enhanceable ? <BadgeStyles badgeContent={level} color="primary" /> : null}
        </div>
        {(isLV99() && animate) ? (
            <ConicImageWrapper>
                <ConicImageContent
                    style={{
                        borderRadius: '3px',
                        backgroundColor: isEquipOwned() ? '#FFF' : '#000',
                        filter: isEquipOwned() ? 'none' : 'brightness(50%)',
                        borderColor: isLV99() ? '#f66fff' : props.enhanceable ? 'blue' : '#000',
                    }}
                    src={`https://eliya-bot.herokuapp.com/img/assets/item/equipment/${props.devnickname}.png`}
                    alt={props.devnickname}
                    onClick={handleOpen}
                />
            </ConicImageWrapper>
        ) : (
            <img
                style={{
                    display: 'block',
                    width: '56px',
                    height: '56px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '3px',
                    margin: '2px',
                    border: '3px solid #000',
                    boxShadow: '0 0 1px 1px 0 #000',
                    backgroundColor: owned ? '#FFF' : '#000',
                    filter: owned ? 'none' : 'brightness(50%)',
                    borderColor: isLV99() ? '#f66fff' : props.enhanceable ? 'blue' : '#000',
                }}
                src={`https://eliya-bot.herokuapp.com/img/assets/item/equipment/${props.devnickname}.png`}
                alt={props.devnickname}
                onClick={handleOpen}
            />
        )}
        <Dialog open={open} onClose={handleClose}>
            <Box style={{ padding: '20px' }}>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Grid item>{props.devnickname}</Grid>
                    <Grid item>id: {props.equip_id}</Grid>
                    <Grid item>{owned ? 'Owned' : 'Not Owned'}</Grid>
                    <Grid item>
                        enhanceable: {props.enhanceable ? 'Yes' : 'No'} : {level}
                    </Grid>
                    {props.enhanceable && (
                        <Button onClick={handleSetLevel99}>
                            Set lv99
                        </Button>
                    )}
                    <Button
                        onClick={handleAddEquip}
                    >
                        Add Equip
                    </Button>
                    <EquipLevel level={upgrade} setLevel={setUpgrade} />
                </Grid>
            </Box>
        </Dialog>
    </div>
);
}
