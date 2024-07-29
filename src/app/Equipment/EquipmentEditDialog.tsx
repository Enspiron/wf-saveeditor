import React from 'react';
import { Box, Dialog } from '@mui/material';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';
import { styled as muistyles } from '@mui/material/styles';
import styled from 'styled-components';

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
    // background: #000;
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
  };

  const isLV99 = () => {
    return props.level === 99;
  };

  const [animate, setAnimate] = React.useState(false);

  const urlFor99 = `https://wfjukebox.b-cdn.net/equipment/${props.devnickname}_enhanced99.png`
  const urlForBase = `https://wfjukebox.b-cdn.net/equipment/${props.devnickname}.png`

const imageUrl = isLV99() ? urlFor99 : urlForBase;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 4, right: 19 }}>
        {props.enhanceable ? <BadgeStyles badgeContent={props.level} color="primary" /> : null}
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
            backgroundColor: isEquipOwned() ? '#FFF' : '#000',
            filter: isEquipOwned() ? 'none' : 'brightness(50%)',
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
            <Grid item>{isEquipOwned() ? 'Owned' : 'Not Owned'}</Grid>
            <Grid item>
              enhanceable: {props.enhanceable ? 'Yes' : 'No'} : {props.level}
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
}
