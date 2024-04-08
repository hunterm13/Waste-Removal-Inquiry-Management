import React, { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Legend } from "recharts";

const KpiPieChart = ({ values, totalInquiries }) => {

    // Add an empty segment representing the total inquiries
    const updatedValues = [...values];

    if (totalInquiries) {
        updatedValues.push([totalInquiries, "Lost/Other"]);
    }

    // Define color mapping for labels
    const colorMapping = {
        "Lost": "#ff5833",
        "Follow Up": "#ffa998",
        "Fencing": "#8dbb2a",
        "Junk Removal": "#db6385",
        "Roll Off": "#38b6a5",
        "Portable Toilet": "#fdb57a"
    };

    // Prepare data for pie chart
    const pieChartData = updatedValues.map(([value, label]) => ({ value, label }));

    return (
        <PieChart width={400} height={500} style={{margin:"0 auto"}}>
            <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
            >
                {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorMapping[entry.label] || "gray"} />
                ))}
            </Pie>
            <Legend iconSize={10} width={400} height={140} layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
    );
};

export default KpiPieChart;
