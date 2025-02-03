import React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import {useNavigate} from 'react-router-dom';
import "../styles/Home.css";
import { Avatar } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/authContext';
import { doSignOut } from '../firebase/auth'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import axios from 'axios';

// TODO: Clean up Home Component

const Home = () => {
  // 로그인한 사용자 정보 가져오기
  const { currentUser } = useAuth();
  // 웹소켓과 연결
  const [socketUrl, setSocketUrl] = useState('ws://localhost:3001');
  // 이전에 주고받은 메세지 목록을 저장하기위해
  const [messageHistory, setMessageHistory] = useState([]);
  // 사용자가 입력중인 메세지를 저장.
  const [message, setMessage] = useState('');
  // 사용자가 수강 중인 강의 목록을 저장.
  const [classes, setClasses] = useState([]); 
  // 사용자가 현재 선택한 강의
  const [currentClass, setCurrentClass] = useState(null);
  // 현재 선택한 강의ID
  const [currentClassId, setCurrentClassId] = useState(null);
  // 현재 선택된 강의의 모든 채팅메세지를 저장하기위함
  const [chatlog, setChatlog] = useState([])
  // 수강된 사람들의 리스트를 알기위함
  const [enrolledUsers, setEnrolledUsers] = useState([]);

  // 웹소켓 서버와 연결 
  // useWebSocket 서버에 연결하고 사용자의 정보를 쿼리 매개변수로 전송
  // 웹소켓을 통해 메세지를 전송 혹은 수신 가능
  // onOpen()으로 연결이 성공했는지 확인
  const { sendMessage,
      sendJsonMessage,
      lastMessage,
      lastJsonMessage,
      readyState,
      getWebSocket, } = useWebSocket(socketUrl, {
        onOpen: () => console.log('websocket opened'),
        queryParams: { //sends the user_id and name as query params
            user_id: currentUser.uid,
            name: currentUser.displayName,
            userClasses: classes.map(course => course._id),
        }
  });

  // 이 useEffect는 웹소켓에서 새로운 메세지를 수신할때마다 chatlog 상태 업데이트
  useEffect(() => {
      if (lastMessage !== null) {
          const m = JSON.parse(lastMessage.data);
          // 내가 보내지않은 메세지가 아닐때만 추가 와 현재 선택된 강의와 일치하는 메세지만 추가가
          if (m.message.sent_uid !== currentUser.uid && m.course === currentClassId) {
              setChatlog((prev) => prev.concat(m.message));
              console.log(m);
              console.log(currentUser.uid);
          }
      }
      // lastMessage 나 currentUser가 변경될때마다 실행.
  }, [lastMessage, currentUser]);

  // 에코 라우트로 연결해서 새로운 강의 데이터를 수신할수 있게함.
  const handleClickSetSocketUrl = useCallback(
    () => setSocketUrl('ws://localhost:3001/echo'),
    []
  );
  // 이 useEffect 함수는 classes가 변경될때마다 실행
  useEffect(() => {
    if (classes.length > 0) {
      handleClickSetSocketUrl();
    }
  }, [classes]);

  const handleClickCloseSocket = useCallback(() => getWebSocket().close(), [getWebSocket]);

  // all the available connection states for the websocket
  const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  // 사용자가 로그인 했을때 수강중인 강의 목록과 채팅기록을 가져온다.
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!currentUser || !currentUser.uid) return; // Wait until currentUser and uid are available

      try {
        // 현재 로그인한 사용자 정보를 서버에서 가져옴옴
        const response = await axios.get('http://localhost:3001/course/enrolled', {
          headers: { 'Content-Type': 'application/json' },
          params: { uid: currentUser.uid },
        });
        if (response.data) {
          // 서버에서 받은 강의목록을 상태 classes 로 저장
          setClasses(response.data);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };
  // 현재 수강과목의 채팅로그를 가져옴
  const fetchChats = async () => {
      if (!currentClassId) return;

      try {
        // 현재 선택된 강의 
          const response = await axios.get('http://localhost:3001/chatroom/chatlog', {
              headers: { 'Content-Type': 'application/json' },
              params: { courseID: currentClassId },
          });
          if (response.data) {
              // 해당 id에대한 채팅로그를 setChatlog로 state 저장.
              setChatlog(response.data);
              console.log(response.data);
          }
      } catch (error) {
          console.error("Error fetching chatlog", error);
      }
  }

      fetchChats();

    fetchEnrolledCourses();
    // 현재 로그인한 사용자가 변경 혹은 강의 ID가 변경될때 useEffect 발동.
  }, [currentUser, currentClassId]);

  useEffect(() => {
    const fetchEnrolledUsers = async () => {
      if (!currentClassId) return; // 코스 ID가 없으면 실행하지 않음
  
      try {
        const response = await axios.get(`http://localhost:3001/course/${currentClassId}/users`, {
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.status === 200) {
          console.log("Fetched users:", response.data);
          setEnrolledUsers(response.data); // 사용자 목록을 상태에 저장
        } else if (response.status === 204) {
          console.log("No users found for this course");
          setEnrolledUsers([]); // 사용자가 없는 경우 빈 배열 설정
        }
  
      } catch (error) {
        console.error("Error fetching enrolled users:", error);
      }
    };  
  
    fetchEnrolledUsers();
  }, [currentClassId]); // `currentClassId`가 변경될 때마다 실행

  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // 사용자가 강의를 클릭하면 실행.
  const handleClassSelect = (course_name, course_id) => {
    // 클래스의 강의명과 ID를 state로 저장.
    setCurrentClass(course_name);
    setCurrentClassId(course_id);
    console.log('handle:', currentClassId);
    // 해당 수강과목의 메세지가 없으면 초기화.
    if (!messages[course_name]) {
      setMessages((prev) => ({ ...prev, [course_name]: [] }));
    }
  };

  // 사용자가 메세지를 전송할때 실행되는 함수수
  const handleSendMessage = (e) => {
    // 페이지 새로고침 방지.
    e.preventDefault();
    // 공백문자만 입력했을경우 와 강의가 선택되지않은경우 전송을 안함.
    if (input.trim() && currentClass) {
      // 기존 setMessages state에 업데이트를 함. 
      // 이전 메세지가 없으면 빈매열 사용 기존배열 있으면 input에 추가.
      setMessages((prevMessages) => ({
        ...prevMessages,
        [currentClass]: [...(prevMessages[currentClass] || []), input], // Ensure currentClass array exists
      }));

      // setChatlog state 업데이트 
      // 기존 chatlog 상태를 유지(prev) 새메시지를 concat()을 통해 추가.
      setChatlog((prev) => prev.concat(
          {sent_msg: input, sent_uid: currentUser.uid, sent_name: currentUser.displayName}));
  
      // 웹소켓을 통해 메세지 전송.
      sendJsonMessage({
        message: input,
        course: currentClassId,
      });
  
      // 보낸후에는 입력필드를 "" 비움.
      setInput("");
    }
  };

    // 스크롤을 항상 최하단으로 이동하게 해줌.
    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
    };

  return (
    <div className="container">
      <div className="class-list">
        <h3>Conversations</h3>
        {classes.length === 0 ? (
          <p>No classes available.</p> // Message when classes array is empty
        ) : (
          <ul>
            {classes.map((course) => (
              <li
                key={course._id}
                onClick={() => handleClassSelect(course.course_name, course._id)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "10px",
                  padding: "10px",
                  transition: "background-color 0.3s",
                  marginTop: "10px",
                  fontSize: "1.1rem",
                  backgroundColor:
                    currentClass === course.course_name ? "#f0f0f0" : "transparent",
                }}
              >
                {course.course_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="chat-room">
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <h1 style={{ whiteSpace: "nowrap" }}>{currentClass ? `${currentClass} Chat` : "Select a Class"}</h1>
            <SearchIcon onClick={()=> navigate('/search')} 
                        style={{fontSize: "1.75rem", marginLeft: "auto", marginTop: "0.625rem", cursor: "pointer"}}/>
            <LogoutIcon onClick={() => { doSignOut().then(() => { navigate('/login') }) }} style={{fontSize: "1.75rem", marginLeft: "0.625rem", marginTop: "8px", cursor: "pointer"}}/>
            <Avatar onClick={()=> navigate('/profile')} alt={currentUser.displayName} src="/static/images/avatar/1.jpg"
                    style={{marginLeft: "10px", marginTop: "5px", cursor: "pointer"}}/>
        </div>
        {currentClass && (
          <div className="chat-box">
            <div className="messages">
              {chatlog?.map((msg, index) => (
                  <div key={`$${index}-${msg.sent_msg}`}>
                      <div
                          style={msg.sent_uid === currentUser.uid ?
                              {flexDirection: "row"} :
                              {flexDirection: "row-reverse"}}
                          className={"messages-div"}
                      >
                          <div style={
                              msg.sent_uid === currentUser.uid ?
                                  {marginLeft: "auto"} :
                                  {marginRight: "auto"}
                          }>
                              <p className={"text-xs text-gray-600"}>{msg?.sent_name}</p>
                              <div className="message" style={
                                  msg.sent_uid === currentUser.uid ?
                                      {marginLeft: "auto"} :
                                      {marginRight: "auto"}
                              } >
                                  {msg.sent_msg}
                              </div>
                          </div>

                          <Avatar
                              alt={msg.sent_name}
                              src="/static/images/avatar/1.jpg"
                              style={{marginLeft: "10px", marginRight: "10px"}}
                          />
                          <AlwaysScrollToBottom/>
                      </div>
                  </div>
              ))}
            </div>

              <form onSubmit={handleSendMessage} className="message-form">
                  <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message"
                      style={{
                          width: "100%",
                          padding: "10px",
                          fontSize: "16px",
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          marginRight: "10px",
                      }}
                  />
                  <button type="submit" className="send-button">
                      Send
                  </button>
              </form>
          </div>
        )}
      </div>
      {currentClass && (
            <div className="user-list" style={{
              padding: "10px"
            }}>
          <h3>Enrolled Users</h3>
          <ul>
            {enrolledUsers.map((user) => (
              <li key={user.id} style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                <Avatar alt={user.name} src={user.avatarUrl} style={{ marginRight: "10px" }} />
                {user.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
