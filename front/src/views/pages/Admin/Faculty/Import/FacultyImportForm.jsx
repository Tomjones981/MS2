import React, { useState } from 'react';
import axiosClient from '../../../../../api/axiosClient'

const FacultyImportForm = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosClient.post('/faculty/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.success);
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Import Faculty Data</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Excel File:</label>
                    <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                </div>
                <button type="submit">Import</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FacultyImportForm;
