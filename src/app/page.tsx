"use client";
import React, { useEffect, useState } from "react";
import { CloudUpload as CloudUploadIcon, Download as DownloadIcon } from "@mui/icons-material";
import { Button, Input, CircularProgress, Box, AppBar, Tabs, Tab, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Characters from './Characters/Characters';
import Equipment from './Equipment/Equipment';
import General from './General/General';
import Inventory from './Inventory/Inventory';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
// 
const axios = require('axios');

const Save = require('./save');
// import { Save, UserEquipmentList } from "./save";
const Fresh = require('./Fresh Account.json');

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

async function CheckCores() {
  //test if cores works using perpage fetch from api
  const url = "http://localhost:8000/api/player?page=0&perPage=25";
  try {
    const response = await axios.get(url); // Response type is now 'any'
    return true;
  }
  catch (error) {
    return false;
  }

}

async function GetSavesFromAPI() {
  const url = "http://localhost:8000/api/player?page=0&perPage=25";
  // const [saves, setSaves] = useState<any | null>(null);
  
  try {
    const response = await axios.get(url); // Response type is now 'any'
    
    if (response.status === 200) {
      // console.log(response.data);
      return response.data;
    } else {
      console.error("Failed to fetch data from API");
    }
    
  } catch (error) {
    console.error("Failed to fetch data from API:", error)
  }

}

async function GetSaveFromList(index:number) {
  const saves = await GetSavesFromAPI();
  const saveID = saves[index].id;
  const url = `http://localhost:8000/api/player/save?id=${saveID}`;
  try {
    const response = await axios.get(url); // Response type is now 'any'
    
    if (response.status === 200) {
      // console.log(response.data);
      return response.data;
    } else {
      console.error("Failed to fetch data from API");
    }
    
  } catch (error) {
    console.error("Failed to fetch data from API:", error)
  }


}



function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

async function action(formData: FormData) {
  const file = formData.get("file");
  if (!file) {
    throw new Error("No file provided");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      try {
        const parsedData = JSON.parse(content!.toString());
        if (Save.isSave(parsedData)) {
          resolve(parsedData);
          Save.addEquipment(20, parsedData);
        } else {
          console.log(parsedData);
          const newSave = Save.makeSave(parsedData);
          resolve(newSave);
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file as Blob);
  });
}

async function handleFileUpload(
  e: React.ChangeEvent<HTMLInputElement>,
  setFileContent: React.Dispatch<React.SetStateAction<typeof Save | null>>,
  setFileName: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const allowedTypes = ["application/json"];
  const maxFileSize = 1024 * 1024; // 1MB (adjust as needed)

  const file = e.target.files && e.target.files[0];
  if (!file) return; // No file selected

  if (!allowedTypes.includes(file.type)) {
    // setError("Invalid file type. Please select a JSON file.");
    return;
  }

  if (file.size > maxFileSize) {
    // setError("File size exceeds the limit.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  setLoading(true);
  // setError(null); // Clear previous errors

  try {
    const json: typeof Save = await action(formData as FormData);
    setFileContent(json);
    setFileName(file.name);
    console.log("Loading file");
    console.log(json);
    //delete equipment id 20
    Save.removeEquipment(20, json);

    //log equipment list
    console.log(json.data.user_equipment_list);
  } catch (error) {
    console.error("Error uploading file:", error);
    // setError("An error occurred while uploading the file.");
  } finally {
    setLoading(false);
  }
}


// fetch_json();

function SaveMenu(props:any) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    console.info(`You clicked ${props.saves[selectedIndex].name}`);
    const save = await GetSaveFromList(selectedIndex);
    console.log((save));
    const new_save = Save.makeSave(save);
    props.setFileContent(new_save);

    
    
    
  };

  const handleMenuItemClick = async (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    //get the save of that user

  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  interface User {
    id: number;
    name: string;
  }

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        <Button onClick={handleClick}>{props.saves[selectedIndex].name}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
              <MenuList id="split-button-menu" autoFocusItem>
              {(props.saves || []).map((option:User, index:any) => (
                <MenuItem
                  key={option.id}
                  selected={index === selectedIndex}
                  onClick={(event) => handleMenuItemClick(event, index)}
                >
                  {option.id}: {option.name}
                </MenuItem>
              ))}
            </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );

}


export default async function Home() {
  const [fileContent, setFileContent] = useState<any | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const [editable, setEditable] = useState(false);
  const [textareaContent, setTextareaContent] = useState('');

  const [latestCommit, setLatestCommit] = useState<any | null>(null);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  useEffect(() => {
    if (fileContent) {
      setTextareaContent(JSON.stringify(fileContent, null, 2));
    }
  }, [fileContent]);

  const handleDownload = () => {
    if (!fileContent) return;
    const blob = new Blob([JSON.stringify(fileContent)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName ?? "download.json";
    a.click();
    URL.revokeObjectURL(url);
  };


  // const saves = await GetSaveFromList(2);
  // console.log(saves);
  // await CheckCores() ? console.log("Cores work") : console.log("Cores don't work");

  interface User {
    id: number;
    name: string;
  }

  const saves = await GetSavesFromAPI();
  const users = saves?.map((save:any, index:any) => {return {id: save.id, name: save.name}});
  // console.log(users);
 
  
  return (
    <main>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ m: 1, position: "relative", justifyContent: "center" }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
          >
            Upload file
            <Input
              type="file"
              style={{ display: "none" }}
              disabled={loading}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, setFileContent, setFileName, setLoading)}
            />
          </Button>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={!fileContent}
          sx={{ mx: 1 }} // Add this line to set the spacing
        >
          Download file
        </Button>
        <Button
          variant="contained"
          startIcon={<InsertDriveFileOutlinedIcon />}
          onClick={() => {
            console.log("Fresh Account");
            setFileContent(Fresh);
          }}
          sx={{ mx: 1 }} // Add this line to set the spacing
        >
          Clean Save Import
        </Button>
        <SaveMenu saves={users || []} setFileContent={setFileContent} />
        <pre>This part is in beta!</pre>
      </Box>
      {/* {fileContent && Save.getUsername(fileContent)} */}
      {fileContent && (
        <Box sx={{ bgcolor: 'background.paper' }}>
          <AppBar position="sticky">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="General" {...a11yProps(0)} />
              <Tab label="Characters" {...a11yProps(1)} />
              <Tab label="Equipment" {...a11yProps(2)} />
              <Tab label="Inventory" {...a11yProps(3)} />
              <Tab label="Text Edit" {...a11yProps(4)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <General fileContent={fileContent} setFileContent={setFileContent} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Characters userlist={fileContent} />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Equipment fileContent={fileContent} setFileContent={setFileContent} />
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
            <Inventory fileContent={fileContent} setFileContent={setFileContent} />
          </TabPanel>
          <TabPanel value={value} index={4} dir={theme.direction}>
            <Typography>
              <Button
                variant="contained"
                onClick={() => {
                  if (editable) {
                    try {
                      const json = JSON.parse(textareaContent);
                      console.log(json);
                      setFileContent(json);
                    } catch (error) {
                      console.error("Error parsing JSON:", error);
                    }
                  } else {
                    setTextareaContent(JSON.stringify(fileContent, null, 2));
                  }
                  setEditable(!editable);
                }}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  margin: "10px",
                }}
              >
                {editable ? "Save" : "Edit"}
              </Button>
            </Typography>
            {editable ? (
              <textarea
                value={textareaContent}
                onChange={(e) => setTextareaContent(e.target.value)}
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  padding: '10px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  margin: '10px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  fontFamily: 'monospace',
                  height: '600px',
                  overflowY: 'auto',
                  width: '100%',
                }}
              />
            ) : (
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  padding: '10px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  margin: '10px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  fontFamily: 'monospace',
                  maxHeight: '600px',
                  overflowY: 'auto',
                }}
              >
                {JSON.stringify(fileContent, null, 2)}
              </pre>
            )}
          </TabPanel>
        </Box>
      )}
    </main>
  );
}
