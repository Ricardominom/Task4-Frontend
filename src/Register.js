import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:5000/register', {
                name,
                email,
                password,
            });
            setSuccess('User registered successfully!');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error);
            } else {
                setError('Error registering user.');
            }
        }
    };

    return (
        <div className="App-header">
            <div className="form-container">
                <h2>User Registration</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name: </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email: </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password: </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </div>
        </div>
    );    
};

export default Register;
