const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const router = express.Router();

const mongoConfig = require('./mongoConfig.json');
const uri = mongoConfig.uri;

// 몽고 연결 펑션
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        return client.db("Fall24LikeLion");
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}



// 웹소켓 연결 및 상태관리.
let connections = new Set();
let classes = {};
//express와 websoket을 결합한 express-ws 라이브러리
router.ws('/', function (ws, req) {

    // 에러이벤트 발생시 콘솔에 추가. 
    ws.on('error', console.error);

    //log the new connection
    console.log("New connection has opened!");

    //쿼리 파라미터에서 유저 아이디, 이름, 강의리스트 추출하여 웹소켓 객체에 저장.
    ws.user_id = req.query.user_id;
    ws.name = req.query.name;
    ws.userClasses = req.query.userClasses.split(',')

    // 새로운 클라이언트 연결을 connections 에 추가.
    connections.add(ws);

    ws.userClasses.forEach((className) => {
        if (classes[className] == null) {
            classes[className] = new Set()
        }
        classes[className].add(ws)
        console.log('added to class: ' + className)
    });

    //on close, log the close event
    ws.on('close', function() {
        console.log('The connection was closed!');
        connections.delete(ws);
    });

    //on message, log the message and send it back to the all the active connections
    // 추가해준거는 className을 받아서 몽고디비에있는 그 클레스 네임에 메시지를 저장하는 로직
    // 'message' 부분이 클라이언트나 서버로부터 메세지를 도착했을때 발생하게하는 websocket event. 
    // ws.on 특정 이벤트가 실행될때 (여기서는 message 이벤트)  펑션 실행.
    ws.on('message', async function (msg) {
        //ws.send(msg + ' received from ' + name);
        let parseMsg = JSON.parse(msg)
        // console.log(parseMsg);
        let currentDate = new Date();
        console.log('received: %s from %s at %s', parseMsg.message, parseMsg.course , currentDate);
        let courseID = parseMsg.course;
        console.log(courseID);
         try{
                const db = await connectToMongo();
                const coursesCollection = db.collection('courses');

                const courseUpdateResult = await coursesCollection.updateOne(
                    { _id: new ObjectId(courseID) },
                    {
                        $addToSet: {
                            chatroom: {
                                sent_at: currentDate,
                                sent_msg: parseMsg.message,
                                sent_uid: ws.user_id,
                                sent_name: ws.name
                            }
                        }
                    }
                );
                console.log('Message stored in MongoDB:', courseUpdateResult);
            }
            catch (error) {
                console.error("Error Storing Messeage", error);
            }



        broadcastToClass(parseMsg.message, ws.user_id, courseID, ws.name);

    });

});

// 특정강의 courseID에 속한 사용자에게만 메세지를 전송.
const broadcastToClass = (msg, userID, courseID, userName) => {
    if (!classes[courseID]) {
        console.error(`Class ${courseID} does not exist`);
        return;
    }

    classes[courseID].forEach((ws) => {
        console.log('sending to user:' + ws.name)
        ws.send(JSON.stringify(
            {
            course: courseID,
            message: {
                sent_msg: msg,
                sent_uid: userID,
                sent_name: userName
            }
            }

        ));
    })
}
module.exports = router;