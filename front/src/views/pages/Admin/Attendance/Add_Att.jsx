import React, { useState } from 'react';
import axiosClient from '../../../../api/axiosClient';

const AttendanceImport = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosClient.post('/import/faculty/attendance', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error(error);
            setMessage('Error occurred during import');
        }
    };

    return (
        <div>
            <h2>Import Attendance</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept=".xlsx, .csv" />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AttendanceImport;
