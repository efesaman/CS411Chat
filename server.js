const credentials = require('./cs411chat-firebase-adminsdk-yidrd-00bb5f132f.json')
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});

const db = admin.firestore();

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
  const chats = req.body.chats;

  await users.doc(id).set({email, id, chats});
});
