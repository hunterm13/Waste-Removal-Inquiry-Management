import { Button, Alert, AlertTitle, Box } from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { addNewReportData } from '../utils/queries';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#3b3a3a',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'

};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

export default function FileDropzone({formType, setSuccess, setUploadingFile}) {
    const [fileName, setFileName] = useState("No file selected");
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploadedFileData, setUploadedFileData] = useState({});
    const [fileData, setFileData] = useState({});
    const [error, setError] = useState(null);
    const [reportDate, setReportDate] = useState(null);

    useEffect(() => {
        setUploadedFileData({});
        setFileUploaded(false);
    }, []);

    useEffect(() => {
        if (fileData && Object.keys(fileData).length !== 0) {
            try{
                const formattedDate = dayjs(reportDate).format('MM-DD-YYYY');
                console.log(fileData);
                const uploadReportData = async () => {
                    await addNewReportData(formType, fileData, formattedDate);
                    
                };
                uploadReportData();
                setFileData({});
                setSuccess(true);
                setUploadingFile(false);
            } catch (error) {
                setError(error);
            }
        }
    }, [fileData]);

    const onDrop = (acceptedFiles) => {
        if(fileUploaded) {
            const confirmOverwrite = window.confirm("Are you sure you want to overwrite the previous file?");
            if (!confirmOverwrite) {
                return;
            }
        }
        acceptedFiles.forEach((file) => {
            setFileName(file.name);
            const reader = new FileReader();
        
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');
            reader.onload = () => {
                // Parse the file
                const binaryStr = reader.result;
                const workbook = XLSX.read(binaryStr, {type:'binary'});
                let sheetName;
                switch(formType) {
                    case "tower":
                    case "podium":
                    case "cms":
                        sheetName = 'Sheet1'; // replace with your sheet name
                        break;
                    case 'telus':
                        sheetName = 'Calls'; // replace with your sheet name
                        break;
                    default:
                        console.log('Invalid formType: ' + formType);
                        return;
                }

                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                setUploadedFileData(jsonData);
                setFileUploaded(true);
                console.log('JSON data:', jsonData);
            };
            reader.readAsBinaryString(file);
        });
    };

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls']
        },
        onDrop,
        maxFiles: 1
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    const processFile = () => {
        // const confirmUpload = window.confirm("Please confirm file matches the correct report type and date.");
        // if(!confirmUpload) {
        //     return;
        // }
        if(formType === "cms") {
            setFileData(
                uploadedFileData.slice(1).map(data => ({
                    name: data["CMS Led board"],
                    leads: data["__EMPTY_1"]
                }))
            );
        }else if(formType === "telus") {
            setFileData(
                uploadedFileData.reduce((acc, data) => {
                    if (parseFloat(data["Call Length"]) >= 0.00277778) {
                        const existingData = acc.find((item) => item.name === data["To Name"]);
                        if (existingData) {
                            existingData.leads += 1;
                        } else {
                            acc.push({ name: data["To Name"], leads: 1 });
                        }
                    }
                    return acc;
                }, [])
            );
        }else if(formType === "podium") {
            setFileData(
                uploadedFileData.slice(1).map(data => ({
                    name: data['Podium Led board'],
                    leads: data['__EMPTY_1']
                }))
            );
        }else if(formType === "tower") {
            setFileData(
                uploadedFileData.map(data => ({
                siteName: data['Site Name'],
                workFlow: data['Workflow'],
                orderDate: data['Order Date'],
                name: data['Order Taken By']
                }))
            );
        }else{
            alert("Invalid form type. Please select a valid form type.");
        }
    };

    return (
        <div className="container">
            {error && <Alert severity="error" style={{marginBottom:"1rem"}} onClose={() => setError("")}> 
                <AlertTitle>{error}</AlertTitle>                
            </Alert>}
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                <p>Drag and drop a file here, or click to select file.</p>
                <p>Only one file can be uploaded at a time, uploading more than one will overwrite the previous file.</p>
            </div>
            <aside style={{marginTop: "1rem"}}>
                <h4>File: {fileName}</h4>
            </aside>
            <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="flex-start" 
                width="auto"
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Report Date"
                        value={reportDate}
                        onChange={(newValue) => setReportDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <Button disabled={!fileUploaded || reportDate === null} style={{marginTop:"1rem"}} onClick={processFile} variant="contained">Upload</Button>
            </Box>
        </div>
    );
}
