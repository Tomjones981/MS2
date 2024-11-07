import React, { useState } from 'react';
import axios from 'axios';

const SocialShare = () => {
    const [formData, setFormData] = useState({
        faculty_name: '',
        faculty_email: '',
        faculty_phone: '',
        address: '',
        phone: '',
        email: '',
        department_name: '',
        head_name: '',
        contact_info: '',
        position: '',
        start_date: '',
        end_date: '',
        rate: '',
        effective_date: '',
        type_name: '',
        unit_name: '',
        unit_description: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/multi-table', formData);
            console.log('Data saved:', response.data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Faculty Information</h2>
            <input type="text" name="faculty_name" placeholder="Faculty Name" onChange={handleChange} />
            <input type="email" name="faculty_email" placeholder="Faculty Email" onChange={handleChange} />
            <input type="text" name="faculty_phone" placeholder="Faculty Phone" onChange={handleChange} />

            <h2>Contact Details</h2>
            <input type="text" name="address" placeholder="Address" onChange={handleChange} />
            <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />

            <h2>Department Information</h2>
            <input type="text" name="department_name" placeholder="Department Name" onChange={handleChange} />
            <input type="text" name="head_name" placeholder="Head Name" onChange={handleChange} />
            <input type="text" name="contact_info" placeholder="Contact Info" onChange={handleChange} />

            <h2>Employment Information</h2>
            <input type="text" name="position" placeholder="Position" onChange={handleChange} />
            <input type="date" name="start_date" placeholder="Start Date" onChange={handleChange} />
            <input type="date" name="end_date" placeholder="End Date" onChange={handleChange} />

            <h2>Faculty Rate</h2>
            <input type="number" name="rate" placeholder="Rate" onChange={handleChange} />
            <input type="date" name="effective_date" placeholder="Effective Date" onChange={handleChange} />

            <h2>Faculty Type</h2>
            <input type="text" name="type_name" placeholder="Type Name" onChange={handleChange} />

            <h2>Unit Information</h2>
            <input type="text" name="unit_name" placeholder="Unit Name" onChange={handleChange} />
            <input type="text" name="unit_description" placeholder="Unit Description" onChange={handleChange} />

            <button type="submit">Save</button>
        </form>
    );
};

export default SocialShare;
