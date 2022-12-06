const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const credentials = require('./cs411chat-firebase-adminsdk-lo2gh-a0c52d6bf2.json')

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
    res.sendFile(__dirname + "/login.html")
});

app.get('/main', function(req, res) {
    res.sendFile(__dirname + "/index.html")
});

server.listen(5500)
console.log('Express server started on port %s', server.address().port)

const users = db.collection('users')
// const chats = db.collection('chats')

io.on('connection', socket => {
  socket.on('send-msg', data => {
    console.log(data)
  })
})

app.post('/api/users/create', async (req, res) => {
  const email = req.body.email;
  const id = req.body.id;
  console.log(id)
  const chats = req.body.chats;

  await users.doc(id).set({email, id, chats});
});
