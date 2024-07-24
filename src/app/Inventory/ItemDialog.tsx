import React from 'react';

export default function Dialog(props: any) {
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
      />
    </div>
  );
}
