import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import axios from '../../axios';

const UploadScreenAuto = () => {
    const { currentUser } = useAuth();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        setLoading(true);
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);
        console.log(currentUser.email)
        formData.append('user', JSON.stringify({
            email: currentUser.email
        }));

        try {
            const response = await axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            });
            alert('Request completed successfully!');
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Processing...' : 'Submit'}
            </button>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default UploadScreenAuto;
