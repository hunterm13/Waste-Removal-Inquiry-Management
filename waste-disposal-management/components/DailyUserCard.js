import { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";

export default function DailyUserCard({userName, reports}) {
    return (
        <Container maxWidth="md" style={{borderRadius:"1rem", backgroundColor:"#666666", padding:"1rem", boxShadow:"8px 8px 11px 0px rgba(0,0,0,0.4)"}}>
            <Typography variant="h4" component="h2" align="center">
                {userName}
            </Typography>
            <table>
                <thead>
                    <tr>
                        <th style={{paddingRight: "5rem"}}>Service</th>
                        <th style={{paddingRight: "2rem"}}>Booked</th>
                        <th style={{paddingRight: "2rem"}}>Follow up</th>
                        <th>Lost</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Roll Off</td>
                        <td>{reports.filter(report => report.service === "Roll Off" && report.leadTag === "Booked").length}</td>
                        <td>{reports.filter(report => report.service === "Roll Off" && report.leadTag === "Follow Up").length}</td>
                        <td>{reports.filter(report => report.service === "Roll Off" && report.leadTag === "Lost").length}</td>
                    </tr>
                    <tr>
                        <td>Junk Removal</td>
                        <td>{reports.filter(report => report.service === "Junk Removal" && report.leadTag === "Booked").length}</td>
                        <td>{reports.filter(report => report.service === "Junk Removal" && report.leadTag === "Follow Up").length}</td>
                        <td>{reports.filter(report => report.service === "Junk Removal" && report.leadTag === "Lost").length}</td>
                    </tr>
                    <tr>
                        <td>Fencing</td>
                        <td>{reports.filter(report => report.service === "Fencing" && report.leadTag === "Booked").length}</td>
                        <td>{reports.filter(report => report.service === "Fencing" && report.leadTag === "Follow Up").length}</td>
                        <td>{reports.filter(report => report.service === "Fencing" && report.leadTag === "Lost").length}</td>
                    </tr>
                    <tr>
                        <td>Portable Toilet</td>
                        <td>{reports.filter(report => report.service === "Portable Toilet" && report.leadTag === "Booked").length}</td>
                        <td>{reports.filter(report => report.service === "Portable Toilet" && report.leadTag === "Follow Up").length}</td>
                        <td>{reports.filter(report => report.service === "Portable Toilet" && report.leadTag === "Lost").length}</td>
                    </tr>
                </tbody>
            </table>
        </Container>
    );
}

