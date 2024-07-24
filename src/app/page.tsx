"use client";
import React, { useEffect, useState } from "react";
import { CloudUpload as CloudUploadIcon, Download as DownloadIcon } from "@mui/icons-material";
import { Button, Input, CircularProgress, Box, AppBar, Tabs, Tab, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Characters from './Characters/Characters';
import Equipment from './Equiment/Equipment';
import General from './General/General';
import Inventory from './Inventory/Inventory';

const Save = require('./save');
import { UserEquipmentList } from "./save";

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
      // try {
        const parsedData = JSON.parse(content!.toString());
        if (Save.isSave(parsedData)) {
          resolve(parsedData);
        } else {
          console.log(parsedData);
          const newSave = Save.makeSave(parsedData);
          resolve(newSave);
          
      //     throw new Error("Uploaded file format is invalid!");
      //   }
      // } catch (error) {
      //   reject(error);
      }
    };
    reader.readAsText(file as Blob);
  });
}

async function handleFileUpload(
  e: React.ChangeEvent<HTMLInputElement>,
  setFileContent: React.Dispatch<React.SetStateAction<any | null>>,
  setFileName: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const formData = new FormData();
  if (e.target.files && e.target.files.length > 0) {
    formData.append("file", e.target.files[0]);
  }
  setLoading(true);
  try {
    const json = await action(formData as FormData);
    setFileContent(json);
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
    console.log("Loading file");
    console.log(json);
  } catch (error) {
    console.error("Error uploading file:", error);
  } finally {
    setLoading(false);
  }
}

export default function Home() {
  const [fileContent, setFileContent] = useState<any | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  useEffect(() => {
    const uploadDummyFile = async () => {
      const debug = false;
      if (debug && fileContent === null) {
        await handleFileUpload(
          {
            target: {
              files: [new File([JSON.stringify({})], "Enspiron_Save.json")],
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>,
          setFileContent,
          setFileName,
          setLoading
        );
      }
    };

    uploadDummyFile();
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
        {loading && <CircularProgress />}
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={!fileContent}
        >
          Download file
        </Button>
      </Box>
      {fileContent && Save.getUsername(fileContent)}
      {fileContent && (
        <Box sx={{ bgcolor: 'background.paper' }}>
          <AppBar position="static">
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
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <General fileContent={fileContent} setFileContent={setFileContent} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Characters userlist={fileContent} />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Equipment fileContent={fileContent} setFileContent={function (value: any): void {
              throw new Error("Function not implemented.");
            } } />
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
            <Inventory fileContent={fileContent} setFileContent={function (value: any): void {
              throw new Error("Function not implemented.");
            } } />
          </TabPanel>
        </Box>
      )}
    </main>
  );
}
