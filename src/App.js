import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './Register';
import Login from './Login';

const App = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [showRegister, setShowRegister] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        if (token) {
            axios.get('https://vercel.com/ricardos-projects-f677a384/myapp-backend/DDRV6ZRBLrWsqWtYq3r8oCDzt8F8/users', { headers: { Authorization: token } })
                .then(response => setUsers(response.data))
                .catch(() => {
                    alert('Unauthorized. Please login.');
                    localStorage.removeItem('token');
                    setToken(null);
                });
        }
    }, [token]);

    const handleLogin = (user) => {
        setCurrentUser(user);
        setToken(localStorage.getItem('token'));
        setShowLogin(false);
    
        setUsers(prevUsers => {
            return prevUsers.map(u => u.id === user.id ? { ...u, last_login: user.last_login } : u);
        });
    };
    
    const handleCheckboxChange = (id) => {
        setSelectedUsers(prev => {
            if (prev.includes(id)) return prev.filter(userId => userId !== id);
            return [...prev, id];
        });
    };

    const handleBlockUsers = () => {
        axios.post('https://vercel.com/ricardos-projects-f677a384/myapp-backend/DDRV6ZRBLrWsqWtYq3r8oCDzt8F8/users/block', { userIds: selectedUsers }, { headers: { Authorization: token } })
            .then(() => {
                setUsers(users.map(user => (selectedUsers.includes(user.id) ? { ...user, status: 'blocked' } : user)));
                setSelectedUsers([]);

                // Verifica si todos los usuarios están bloqueados
                if (users.every(user => user.status === 'blocked' || selectedUsers.includes(user.id))) {
                    window.location.href = '/'; // Redirige a la página de inicio
                }
            });
    };

    const handleUnlockUsers = () => {
        axios.post('https://vercel.com/ricardos-projects-f677a384/myapp-backend/DDRV6ZRBLrWsqWtYq3r8oCDzt8F8/users/unblock', { userIds: selectedUsers }, { headers: { Authorization: token } })
            .then(() => {
                setUsers(users.map(user => (selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user)));
                setSelectedUsers([]);
            });
    };

    const handleDeleteUser = (id) => {
        axios.delete(`https://vercel.com/ricardos-projects-f677a384/myapp-backend/DDRV6ZRBLrWsqWtYq3r8oCDzt8F8/users/${id}`, { headers: { Authorization: token } })
            .then(() => {
                setUsers(users.filter(user => user.id !== id));
            });
    };

    const toggleRegisterForm = () => {
        setShowRegister(!showRegister);
    };

    const toggleLoginForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div className="container mt-5">
            <h2>User Management</h2>
            {!currentUser ? (
                <>
                    <button className="btn btn-primary" onClick={toggleLoginForm}>
                        {showLogin ? 'Cancel' : 'Login'}
                    </button>
                    {showLogin && <Login onLogin={handleLogin} />}
                    <button className="btn btn-secondary" onClick={toggleRegisterForm}>
                        {showRegister ? 'Cancel' : 'New User'}
                    </button>
                    {showRegister && <Register onSuccess={(newUser) => {
                        setUsers(prevUsers => [...prevUsers, newUser]);
                        toggleRegisterForm();
                    }} />}
                </>
            ) : (
                <div>
                    <p>Welcome, {currentUser.name}</p>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-danger btn-sm me-2" onClick={() => { 
                            setCurrentUser(null); 
                            setToken(null); 
                            localStorage.removeItem('token'); 
                        }}>
                            Logout
                        </button>
                        <button className="btn btn-dark btn-sm me-2" onClick={handleBlockUsers}>Block</button>
                        <button className="btn btn-primary btn-sm" onClick={handleUnlockUsers} disabled={selectedUsers.length === 0}>
                            Unblock
                        </button>
                    </div>
                </div>
            )}
            {currentUser && (
                <table className="table mt-3">
                    <thead>
                        <tr>
                            <th><input type="checkbox" onChange={(e) => setSelectedUsers(e.target.checked ? users.map(user => user.id) : [])} /></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Last Login</th>
                            <th>Registration Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleCheckboxChange(user.id)} /></td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</td>
                                <td>{new Date(user.registration_time).toLocaleString()}</td>
                                <td>{user.status}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                    {user.status === 'blocked' && (
                                        <button className="btn btn-primary" onClick={() => handleUnlockUsers(user.id)}>
                                            Unblock
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default App;
