import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const ALLOWED_EMAIL = "lsbgch@gmail.com"; // Replace with the actual allowed email

const Signin = ({ onLogin, onLogout }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const login = useGoogleLogin({
       
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => {
            console.log('Login Failed:', error);
            setError("Google login failed. Please try again.");
        }
    });

    useEffect(() => {
        const savedProfile = localStorage.getItem("googleUser");
        if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            if (parsed.email === ALLOWED_EMAIL) {
                setProfile(parsed);
                onLogin && onLogin(parsed);
            } else {
                localStorage.removeItem("googleUser");
            }
        }
    }, []);

    useEffect(() => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    if (res.data.email === ALLOWED_EMAIL) {
                        setProfile(res.data);
                        localStorage.setItem("googleUser", JSON.stringify(res.data));
                        onLogin && onLogin(res.data);
                    } else {
                        setError("Unauthorized email. Access denied.");
                        logout(); // immediately log out if not allowed
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setError("Failed to fetch user profile.");
                });
        }
    }, [user]);

    const logout = () => {
        setProfile(null);
        localStorage.removeItem("googleUser");
        onLogout && onLogout();
        navigate("/");  //redirection to homepage
    };


    return (
        <div>
            {profile ? (
                <div style={styles.loggedInContainer}>
                    <span style={styles.welcome}>Welcome, {profile.name}!</span>
                    <button onClick={logout} style={styles.logoutButton}>Log out</button>
                </div>
            ) : (
                <div>
                <button onClick={login} style={styles.button}>
                    Sign in with Google 🚀
                </button>
                {error && <p style={styles.error}>{error}</p>}
                </div>
            )}
        </div>
    );
};

const styles = {
    button: {
        padding: '10px 20px',
        backgroundColor: '#4285F4',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    logoutButton: {
        padding: '10px 20px',
        backgroundColor: '#DB4437',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginLeft: '10px'
    },
    loggedInContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    welcome: {
        color: 'black',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        marginTop: '0px'
    }
};

export default Signin;
