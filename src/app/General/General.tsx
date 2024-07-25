import React from "react";
const Save = require('../save');
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function General(props:any) {
    const save = props.fileContent;

    return (
        <div>
            <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >

      <div>
        
        {/* <TextField
          id="standard-helperText"
          label="Helper text"
          defaultValue="Default Value"
          helperText="Some important text"
          variant="standard"
        /> */}
      </div>
    </Box>
        </div>
    );
}