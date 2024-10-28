var express = require('express');
const {connect} = require("net");
var router = express.Router();

//set to store all connections
var connections = new Set();

router.ws('/', function (ws, req) {

    //on error, log the error
    ws.on('error', console.error);

    //log the new connection
    console.log("New connection has opened!");

    //get the user_id and name from the query params
    let { user_id, name } = req.query;

    //add to the active connection set
    connections.add(ws);

    //on close, log the close event
    ws.on('close', function() {
        console.log('The connection was closed!');
        connections.delete(ws);
    });

    //on message, log the message and send it back to the all the active connections
    ws.on('message', function (msg) {
        //ws.send(msg + ' received from ' + name);
        broadcast(name + " sent: " + msg);
        console.log('received: %s from %s', msg, name);
    });
});

//broadcast function to send message to all active connections
const broadcast = (msg) => {

    //loop through all the active connections
    connections.forEach((ws)=>{
        //if the connections are objects with info use something like ws.ws.send()
        ws.send(msg);
    })
}
module.exports = router;