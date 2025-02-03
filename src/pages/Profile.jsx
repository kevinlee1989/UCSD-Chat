import React from "react";
import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useAuth } from '../contexts/authContext';
import "../styles/Profile.css";
import axios from 'axios';

// 이 컴포넌트는 사용자의 프로필정보를 관리하는 기능.
const Profile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [classes, setClasses] = useState([]); // State for enrolled classes
    // 사용자가 이름을 변경하고 "save" 버튼을 클릭하면 실행됨.
    const handleSave = async () => {
        try {
            // 프론트엔드에서 setName state를 받아와서 name에 저장하고 그걸 서버로 put 메소드로 보냄.
            const response = await axios.put('http://localhost:3001/auth/name', {
                headers: { 'Content-Type': 'application/json' },
                params: {uid: currentUser.uid, name: name}
            })

            if (response.status === 200) {
                alert(`Profile Updated!\nName: ${name}`);
            }
        } catch (error) {
            alert('An error occurred while changing name');
        }
    };

    //강의 삭제 버튼.
    const dropCourse = async (courseId) => {
        try {
            // 수강 ID 서버로 보내고 delete로. 
            const response = await axios.delete('http://localhost:3001/course', {
                headers: { 'Content-Type': 'application/json' },
                params: {uid: currentUser.uid, courseId: courseId}
            });

            if (response.status === 200) {
                alert("Course deleted successfully!");
                setClasses(classes.filter(course => course._id !== courseId)); // Update UI
            }
        } catch (error) {
            console.error("Error deleting a course:", error);
            alert("An error occurred while deleting the course.");
        };
    };

    // 수강중인 강의 목록 가져오기.
    useEffect(() => {
        const fetchEnrolledCourses = async () => {
          if (!currentUser || !currentUser.uid) return; // Wait until currentUser and uid are available
    
          try {
            const response = await axios.get('http://localhost:3001/course/enrolled', {
              headers: { 'Content-Type': 'application/json' },
              params: { uid: currentUser.uid },
            });
            if (response.data) {
              setClasses(response.data);
            }
          } catch (error) {
            console.error("Error fetching enrolled courses:", error);
          }
        };
    
        fetchEnrolledCourses();
        // currentUser가 변경되면 이 함수 발동.
      }, [currentUser]);
    

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
                {classes.map((course) => (
                    <div key={course._id} className="class-item">
                        <div className="class-info">
                            <h3>{course.course_name}</h3>
                            <p>NA</p>
                        </div>
                        <button
                            className="delete-button"
                            onClick={() => dropCourse(course._id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;