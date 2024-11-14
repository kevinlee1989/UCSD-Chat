import React from "react";
import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useAuth } from '../contexts/authContext';
import "../styles/Profile.css";

const Profile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [classes] = useState([
        { name: "Class Name 1", description: "Description for class 1." },
        { name: "Class Name 2", description: "Description for class 2." },
        { name: "Class Name 3", description: "Description for class 3." },
    ]);

    const handleSave = () => {
        alert(`Profile Updated!\nName: ${name}\nPassword: ${password}`);
    };
    

    return (
        <div className="settings-container">
            <div style={{display:"flex"}}>
            <KeyboardBackspaceIcon onClick={()=> navigate('/')}
                                    style={{fontSize: "40px", cursor: "pointer"}}/>
            <h2>Profile</h2>
            </div>
            <div className="change-profile">
            <div className="name-section">
                <h2>Name</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="name-input"
                />
            </div>
            <div className="password-section">
                <h2>Password</h2>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="password-input"
                />
            </div>
            <button onClick={handleSave} className="save-button">Save</button>
            </div>
            
            <h2>Classes</h2>
            <div className="class-list1">
                {classes.map((classItem, index) => (
                    <div key={index} className="class-item">
                        <div className="class-info">
                            <h3>{classItem.name}</h3>
                            <p>{classItem.description}</p>
                        </div>
                        <button className="delete-button">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;