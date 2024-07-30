import React from 'react';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

const Save = require('../save');

import Max from './awakening_max.png'
export default function EquipLevel(props:any) {
    const grey = "https://wfjukebox.b-cdn.net/ribbons/awakening_gray.png";
    const gold = "https://wfjukebox.b-cdn.net/ribbons/awakening_color.png"

    

    const [edit, setEdit] = React.useState(false);
    const [level, setLevel] = React.useState(props.level);
    function isMax() {
        console.log(props.level)
        return level > 4;
    }

    function GoldImage(props:any) {
        return(
            <img
            style={{
                width: '20px',
                marginRight: '2px',

            }}
            src={gold} alt="Gold" 
            // onMouseEnter={handlemouseEnter}
            />
        )
    }

    function GreyImage(props:any) {
        return(
            <img 
            style={{
                width: '20px',
                marginRight: '2px',
            }}
            src={grey} alt="Grey" 
            // onMouseEnter={handlemouseEnter}
            />
        )
    }

    function handleChange(e:any) {
        //handle the change for the rating value
        setLevel(e.target.value+1)
        console.log("is max? ", isMax())

    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div>

            <Rating
                name="Equip"
                defaultValue={level}
                max={4}
                precision={1}
                icon={<GoldImage />}
                emptyIcon={<GreyImage />}
                readOnly={edit}
                style={{
                    // if edit is false then background grey with border otherwise no background
                    backgroundColor: edit ? "white" : "#f5f5f5",
                    borderRadius: "10px",
                    filter: edit ? "brightness(90%)" : "brightness(100%)",
                    padding: "10px",
                }}
                onChange={handleChange}
                />
            {isMax() ? <img src={Max.src} alt="Max" 
            style={{ 
                position: 'absolute',
                right: '50%',
                bottom: '10%',
                width: '40px' 
            }} /> : null}
            </div>
            <Button
                onClick={() => setEdit(!edit)}
                variant="outlined"
                style={{
                    height: '30px',
                }}
                component="button"
            >
                {edit ? "Edit" : "Save"}
            </Button>
        </div>
    );


}