
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axiosClient from '../../../../../api/axiosClient';

const PWD_BarGraph = () => {
    const [barangayData, setBarangayData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosClient.get('/pwd-brgy-report-counts')
            .then(response => {
                setBarangayData(response.data.barangay_counts);
                setLoading(false);
            })
            .catch(() => {
                setError('Error fetching data');
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-5 text-center text-gray-600 dark:text-gray-200 font-serif">
                PWD Barangay Distribution
            </h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barangayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="barangay" angle={-45} textAnchor="end" height={80} interval={0} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4A90E2" barSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default PWD_BarGraph;
