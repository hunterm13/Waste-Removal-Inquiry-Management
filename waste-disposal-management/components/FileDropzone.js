import { Button, Alert, AlertTitle, Box, TextField } from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useDropzone} from "react-dropzone";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { addNewReportData } from "../utils/queries";
import { styled } from "@mui/system";
import ExcelJS from "exceljs";

const FadeAlert = styled(Alert)(({ theme }) => ({
    opacity: 0,
    marginBottom: "1rem",
    transition: "opacity 0.1s ease-in-out",
    "&.show": {
      opacity: 1,
    },
  }));

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#3b3a3a",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out"

};

const focusedStyle = {
  borderColor: "#2196f3"
};

const acceptStyle = {
  borderColor: "#00e676"
};

const rejectStyle = {
  borderColor: "#ff1744"
};

export default function FileDropzone({formType, setSuccess, setUploadingFile}) {
    const [fileName, setFileName] = useState("No file selected");
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploadedFileData, setUploadedFileData] = useState({});
    const [fileData, setFileData] = useState({});
    const [error, setError] = useState(null);
    const [reportDate, setReportDate] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setUploadedFileData({});
        setFileUploaded(false);
    }, []);

    useEffect(() => {
        if (fileData && Object.keys(fileData).length !== 0) {             
            const uploadReportData = async () => {
                try{
                    console.log(fileData);
                    await addNewReportData(formType, fileData);                    
                    setFileData({});
                    setSuccess(true);
                    setUploadingFile(false);
                } catch (error) {
                    setError(error.message);
                }
            };
            uploadReportData();
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
        
            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = () => {
                // Parse the file
                const binaryStr = reader.result;
                const workbook = XLSX.read(binaryStr, {type:"binary", cellStyles: true});
                let sheetName = "";
                if (formType == "telus") {
                    sheetName = "Calls";
                } else {
                    sheetName = workbook.SheetNames[0];
                }

                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                if (formType === "tower") {
                    const updatedData = jsonData.map((item, index) => {
                        const cell = `A${index + 2}`;
                        const cellColor = worksheet[cell].s && worksheet[cell].s.fgColor ? worksheet[cell].s.fgColor.rgb : null;
                        const isCancelled = cellColor === "FF99CC" ? true : false;
                        return { ...item, Cancelled: isCancelled, CellColor: cellColor };
                    });
                    const filteredData = updatedData.filter(item => item.CellColor === "FF99CC" || item.CellColor === "CCFFFF");
                    setUploadedFileData(filteredData);
                    console.log(filteredData);
                    setFileUploaded(true);
                }
                else{
                    setUploadedFileData(jsonData);
                    console.log(jsonData);
                    setFileUploaded(true);
                }                
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
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        "application/vnd.ms-excel": [".xls"]
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
        const confirmUpload = window.confirm("Please confirm file matches the correct report type and date.");
        if(!confirmUpload) {
            return;
        }
        const formattedDate = dayjs(reportDate).format("MM-DD-YYYY");
        setFileData({});
        if(formType === "podiumCms") {
            const cmsData = uploadedFileData.slice(1).map(data => ({
                name: data["Name"],
                leads: data["CMS"]
            })).filter(data => data.leads !== 0 && data.leads !== undefined);
        
            const podiumData = uploadedFileData.slice(1).map(data => ({
                name: data["Name"],
                leads: data["POD"]
            })).filter(data => data.leads !== 0 && data.leads !== undefined);
            setFileData({
                date: formattedDate,
                cmsData,
                podiumData
            });
        }else if(formType === "telus") {
            setFileData({
                date: formattedDate,
                ...uploadedFileData.reduce((acc, data) => {
                    const existingData = acc.find((item) => item.name === data["To Name"]);
                    if (existingData) {
                        existingData.leads += 1;
                    } else {
                        acc.push({ name: data["To Name"], leads: 1 });
                    }
                    return acc;
                }, [])
            });
        }else if(formType === "tower") {
            setFileData({
                date: formattedDate,
                ...uploadedFileData.map(data => {
                    let workFlow = data["Workflow"];
                    if (workFlow === "SERVICE-JR") {
                        workFlow = "SERVICEJR";
                    }
                    const newData = {
                        cancelled: data["Cancelled"],
                        siteName: data["Site Name"],
                        workFlow: workFlow,
                        orderDate: data["Order Date"],
                        name: data["Order Taken By"],
                        region: data["Region"],
                    };
                    console.log(newData);
                    return newData;
                }).filter(data => data.region !== undefined)
            });            
        }else{
            alert("Invalid form type. Please select a valid form type.");
        }
    };

    useEffect(() => {
        if (error) {
          setShow(true);
          setTimeout(() => {
            setError("");
            setShow(false);
          }, 5000);
        }
      }, [error]);

    return <>
        <div className="container">
            <FadeAlert severity='error' className={show ? "show" : ""} onClose={() => setError("")}>
                <AlertTitle>{error}</AlertTitle>
            </FadeAlert>
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
                {formType != "tower" && 
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                    label="Report Date"
                    value={reportDate}
                    onChange={(newValue) => setReportDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>}
                <Button disabled={!fileUploaded || (reportDate === null && formType != "tower")} style={{marginTop:"1rem"}} onClick={processFile} variant="contained">Upload</Button>
            </Box>
        </div>
    </>;
}
