import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../CSS/Auth.css'; // Import the shared CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Redirect to the UserDetails page first to gather personal details
            navigate('/user-details'); 
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login to Vikasit Bharat</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="auth-input"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="auth-input"
                />
                <button type="submit" className="auth-button">Login</button>
            </form>
            <p className="auth-text">
                Don't have an account? <Link to="/register" className="auth-link">Register Now!</Link>
            </p>
        </div>
    );
};

export default Login;
