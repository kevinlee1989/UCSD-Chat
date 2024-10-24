var express = require('express');
const {connect} = require("net");
var router = express.Router();
var connections = new Set();

router.ws('/', function (ws, req) {
    ws.on('error', console.error);
    console.log("New connection has opened!");
    let { user_id, name } = req.query;
    connections.add(ws);
    ws.on('close', function() {
        console.log('The connection was closed!');
        connections.delete(ws);
    });
    ws.on('message', function (msg) {
        //ws.send(msg + ' received from ' + name);
        broadcast(name + " sent: " + msg);
        console.log('received: %s from %s', msg, name);
    });
});

const broadcast = (msg) => {
    connections.forEach((ws)=>{
        //if the connections are objects with info use something like ws.ws.send()
        ws.send(msg)
    })
}
module.exports = router;