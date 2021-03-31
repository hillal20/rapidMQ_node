const express = require("express")
const bodyParser = require("body-parser")
const mq = require("amqplib")

const server = express()
server.use(bodyParser.json())


server.get('/rbbitmq', (req, res)=> {
  
    mq.connect("amqp://localhost")
.then(conn => {
    conn.createChannel()
    .then(ch => {
        const queue = "test_1"
        ch.assertQueue(queue)
        .then( q => {
            console.log("q ==> ", q)
        })
        .catch(err => {
            console.log("queue err ==> ", err)
        })
        //sending message 
        ch.sendToQueue(queue, Buffer.from(JSON.stringify({name:'hilal', age:'30'}), 'utf8'))
        ch.consume(queue,  msg => {
            
            const obj = msg.content.toString();
            console.log("msg ==> ", obj)
        
    }, {
        noAck:true
    })})
    .catch(err => {
        console.log(" channel err => ", err)
    })

})
.catch(err => {
console.log(" connection err ===> ", err)
})

})



server.get("/api", (req,res)=> {

    res.status(200).json({data:"***  api is working ***"})
})


server.listen(4000, ()=> {
    console.log(" === server is on port 4000 ===")
})