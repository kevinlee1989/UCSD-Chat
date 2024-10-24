import { useAuth } from '../../contexts/authContext'
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const Home = () => {
    const { currentUser } = useAuth();

    const [socketUrl, setSocketUrl] = useState('ws://localhost:3001');
    const [messageHistory, setMessageHistory] = useState([]);
    const [message, setMessage] = useState('');
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage]);

    const handleClickChangeSocketUrl = useCallback(
        () => setSocketUrl('ws://localhost:3001/echo'),
        []
    );

    const handleClickSendMessage = useCallback(() => sendMessage(message), [message]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <>
            <div
                className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email},
                you are now logged in.
            </div>
            <div>
                <button onClick={handleClickChangeSocketUrl}>
                    Click Me to change Socket Url
                </button>
                <br/>
                <label>
                    Text input: <input
                    name="myInput"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                </label>
                <br/>
                <button
                    onClick={handleClickSendMessage}
                    disabled={readyState !== ReadyState.OPEN}
                >
                    Click Me to send {message}
                </button>
                <br/>
                <span>The WebSocket is currently {connectionStatus}</span>
                {lastMessage ?
                    <span>Last message: {lastMessage.data}</span> : null}
                <ul>
                    {messageHistory.map((message, idx) => (
                        <span key={idx}>{message ? message.data : null}</span>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Home