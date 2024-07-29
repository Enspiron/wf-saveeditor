// "use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

// const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
//     height: 10,
//     borderRadius: 5,
//     [`&.${linearProgressClasses.colorPrimary}`]: {
//       backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
//     },
//     [`& .${linearProgressClasses.bar}`]: {
//       borderRadius: 5,
//       backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
//     },
//   }));

export default function Loading() {

    return (
        <div>
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
            
        </div>
    );
}