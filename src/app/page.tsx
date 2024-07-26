"use client";
import React, { useEffect, useState } from "react";
import { CloudUpload as CloudUploadIcon, Download as DownloadIcon } from "@mui/icons-material";
import { Button, Input, CircularProgress, Box, AppBar, Tabs, Tab, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Characters from './Characters/Characters';
import Equipment from './Equiment/Equipment';
import General from './General/General';
import Inventory from './Inventory/Inventory';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import jsonnet from 'jsonnet';

const axios = require('axios');

const json_link = "https://raw.githubusercontent.com/blead/eliyabot-assets/master/src/characters.jsonnet"

const Save = require('./save');
import { UserEquipmentList } from "./save";
const Fresh = require('./Fresh Account.json');

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
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
  } catch (error) {
    console.error("Error uploading file:", error);
    // setError("An error occurred while uploading the file.");
  } finally {
    setLoading(false);
  }
}

async function fetch_json(): Promise<void> {
  const link = "http://localhost:8000/api/player/save?id=1";

  try {
    const response = await axios.get(link); // Response type is now 'any'

    if (response.status >= 200 && response.status < 300) {
      console.log("API Response:", response.data);

      // Handle the specific success case (e.g., update UI, store data, etc.)
      // Since the response type is 'any', you'll need to check its structure before using it.
      if (typeof response.data === "object") {
        // Example: Assuming the response is an object with a 'name' property
        console.log("Player name:", response.data.name);
      } else {
        console.log("Response data:", response.data);
      }
    } else {
      // Handle errors that indicate an issue on the server-side (4xx or 5xx)
      console.error(
        `Error from API: ${response.status} - ${response.statusText}`,
        response.data
      );
    }
  } catch (error:any) {
    // Handle errors that occur during the request itself (network issues, etc.)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Axios Error: ${error.response.status} - ${error.response.statusText}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and"No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  }
}

// fetch_json();

export default function Home() {
  const [fileContent, setFileContent] = useState<any | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const [editable, setEditable] = useState(false);
  const [textareaContent, setTextareaContent] = useState('');

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

  async function fetch_json() {
    const link = "http://localhost:8000/api/player/save?id=1";
    const response = await fetch(link).then((response) => response.json()).then((data) => {
      console.log(data);
    //  setFileContent(data);
    }
    );

}


  // fetch_json();
  
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
      </Box>
      {fileContent && Save.getUsername(fileContent)}
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
