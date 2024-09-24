import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            localStorage.setItem('token', response.data.token);
            onLogin(response.data.user); 
        } catch (err) {
            setError('Failed to log in. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button className="btn btn-success" type="submit">Login</button>
        </form>
    );
};

export default Login;
