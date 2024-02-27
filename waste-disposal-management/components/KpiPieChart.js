import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';

const KpiPieChart = ({ values, totalInquiries }) => {

    // Add an empty segment representing the total inquiries
    const updatedValues = [...values];

    if (totalInquiries) {
        updatedValues.push([totalInquiries, 'Lost/Other']);
    }

    // Define color mapping for labels
    const colorMapping = {
        'Lost/Other': '#ff5833',
        'Fencing': '#3583cc',
        'Junk Removal': '#a879d5',
        'Roll Off': '#ffa600',
        'Portable Toilet': '#fb67ad'
    };

    // Prepare data for pie chart
    const pieChartData = updatedValues.map(([value, label]) => ({ value, label }));

    return (
        <PieChart width={800} height={400} style={{margin:'0 auto'}}>
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
                    <Cell key={`cell-${index}`} fill={colorMapping[entry.label] || 'gray'} />
                ))}
            </Pie>
            <Legend iconSize={10} width={250} height={140} layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
    );
};

export default KpiPieChart;
