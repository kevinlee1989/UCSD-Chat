import { useAuth } from '../../contexts/authContext'
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './Home.css';

const Home = () => {

    //get the current user from the auth context
    const { currentUser } = useAuth();

    // initial socket url
    const [socketUrl, setSocketUrl] = useState('ws://localhost:3001');

    // state to store the message history
    const [messageHistory, setMessageHistory] = useState([]);

    // state to store the message to be sent
    const [message, setMessage] = useState('');

    // useWebSocket hook to connect to the websocket
    const { sendMessage,
            sendJsonMessage,
            lastMessage,
            lastJsonMessage,
            readyState,
            getWebSocket, } = useWebSocket(socketUrl, {
        onOpen: () => console.log('websocket opened'),
        shouldReconnect: (closeEvent) => true,
        queryParams: { //sends the user_id and name as query params
            user_id: currentUser.uid,
            name: currentUser.displayName
        }
    });

    // useEffect to update the message history when a new message is received
    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage]);

    // function to open the socket connection to the echo route
    const handleClickSetSocketUrl = useCallback(
        () => setSocketUrl('ws://localhost:3001/echo'),
        []
    );

    // function to close the socket connection when the button is clicked
    const handleClickCloseSocket = useCallback(() => getWebSocket().close(), [getWebSocket]);

    // function to send the message when the button is clicked
    const handleClickSendMessage = useCallback(() => sendMessage(message), [message, sendMessage]);


    // all the available connection states for the websocket
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <>
            {/*Default welcome message*/}
            <div
                className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email},
                you are now logged in.
            </div>
            <div>
                {/*Button to start the connection*/}
                <button
                    onClick={handleClickSetSocketUrl}
                    className={"button-test"}
                >
                    Open Socket Connection
                </button>

                {/*Button to close the connection*/}
                <button
                    onClick={handleClickCloseSocket}
                    className={"button-test"}
                >
                    Close Socket Connection
                </button>

                <br/>

                {/*Input field to send the message*/}
                <label>
                    Text input: <input
                    name="myInput"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={"input-test"}
                />
                </label>

                <br/>

                {/*Button to send the message only if the connection is open*/}
                <button
                    onClick={handleClickSendMessage}
                    disabled={readyState !== ReadyState.OPEN}
                    className={"button-test"}
                >
                    Click Me To Send The Message
                </button>

                <br/>

                {/*Display the connection status and green when Open and red when other states*/}
                <span>The WebSocket is currently {
                    connectionStatus === 'Open' ?
                        <span className={"text-green-500"}>{connectionStatus}</span> :
                        <span className={"text-red-500"}>{connectionStatus}</span>
                }
                </span>

                <br/>

                {/*Display the last message received in red if it exists*/}
                {lastMessage ?
                    <span className={"text-red-500"}>
                        Last message: {lastMessage.data}
                    </span> : null
                }

                {/*Display the message history using a map function*/}
                <ul>
                    {messageHistory.map((message, idx) => (
                        <>
                            <span
                                key={idx}>{message ? message.data : null}
                            </span>
                            <br/>
                        </>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Home