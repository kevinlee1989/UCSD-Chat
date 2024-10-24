import { useAuth } from '../../contexts/authContext'
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './Home.css';

const Home = () => {
    const { currentUser } = useAuth();

    const [socketUrl, setSocketUrl] = useState('ws://localhost:3001');
    const [messageHistory, setMessageHistory] = useState([]);
    const [message, setMessage] = useState('');
    const { sendMessage,
            sendJsonMessage,
            lastMessage,
            lastJsonMessage,
            readyState,
            getWebSocket, } = useWebSocket(socketUrl, {
        onOpen: () => console.log('websocket opened'),
        shouldReconnect: (closeEvent) => true,
        queryParams: {
            user_id: currentUser.uid,
            name: currentUser.displayName
        }
    });
    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage]);

    const handleClickSetSocketUrl = useCallback(
        () => setSocketUrl('ws://localhost:3001/echo'),
        []
    );
    const handleClickCloseSocket = useCallback(() => getWebSocket().close(), [getWebSocket]);

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
                <button
                    onClick={handleClickSetSocketUrl}
                    className={"button-test"}
                >
                    Open Socket Connection
                </button>
                <button
                    onClick={handleClickCloseSocket}
                    className={"button-test"}
                >
                    Close Socket Connection
                </button>
                <br/>
                <label>
                    Text input: <input
                    name="myInput"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={"input-test"}
                />
                </label>
                <br/>
                <button
                    onClick={handleClickSendMessage}
                    disabled={readyState !== ReadyState.OPEN}
                    className={"button-test"}
                >
                    Click Me To Send The Message
                </button>
                <br/>
                <span>The WebSocket is currently {
                    connectionStatus === 'Open' ?
                        <span className={"text-green-500"}>{connectionStatus}</span> :
                        <span className={"text-red-500"}>{connectionStatus}</span>
                }</span>
                <br/>
                {lastMessage ?
                    <span
                        className={"text-red-500"}
                    >Last message: {lastMessage.data}</span> : null}
                <ul>
                    {messageHistory.map((message, idx) => (
                        <>
                            <span
                                key={idx}>{message ? message.data : null}</span>
                            <br/>
                        </>

                    ))}
                </ul>
            </div>
        </>
    )
}

export default Home