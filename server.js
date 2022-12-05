const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const credentials = require('./cs411chat-firebase-adminsdk-lo2gh-8a7f70bb98.json')

initializeApp({
  credential: cert(credentials)
});

const db = getFirestore();

const io = require('socket.io')(3000)
const express = require('express')
var http = require('http')
var app = express()
var server = http.createServer(app)

app.use(express.json())
app.use(express.static('src'));
app.use(express.urlencoded({extended: true}))

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html")
});

server.listen(5500)
console.log('Express server started on port %s', server.address().port)

const users = db.collection('users')
const chats = db.collection('chats')

io.on('connection', socket => {
  socket.on('send-msg', data => {
    console.log(data)
  })
})
