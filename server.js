const credentials = require('./cs411chat-firebase-adminsdk-yidrd-00bb5f132f.json')
const admin = require("firebase-admin")

admin.initializeApp({
  credential: admin.credential.cert(credentials)
})

const db = admin.firestore()
const users = db.collection('users')
const chats = db.collection('chats')

const express = require('express')
var http = require('http')
var app = express()
var server = http.createServer(app)
server.listen(3000)
console.log('Express server started on port %s', server.address().port)
const io = require('socket.io')(server)

app.use(express.json())
app.use(express.static('src'))
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    res.render("login")
})

app.get('/main', function(req, res) {
    res.render("main")
})

app.get('/:chat', function(req, res) {
    res.render("chat", {chatIndex: req.params.chat})
})

app.post('/api/users/create', async (req, res) => {
  const email = req.body.email
  const chats = req.body.chats

  await users.doc(email).set({email, chats})
})

app.get('/api/user', async (req, res) => {
  const email = req.query.email
  const user = await users.doc(email).get()

  res.json(user)
})

app.post('/api/chats/create', async (req, res) => {
  const receiverEmail = req.body.receiverEmail
  const userEmail = req.body.userEmail
  const messages = []
  const chat_id = "" + userEmail + receiverEmail

  chats.doc(chat_id).set({
    id: chat_id,
    user1: userEmail,
    user2: receiverEmail,
    messages: messages
  })

  users.doc(userEmail).update({
    chats: admin.firestore.FieldValue.arrayUnion(chat_id)
  })

  users.doc(receiverEmail).update({
    chats: admin.firestore.FieldValue.arrayUnion(chat_id)
  })
})

io.on("connection", socket => {
  socket.on("chat-connected", (chat) => {
    socket.join(chat)
  })
  socket.on("send-chat-message", (user, chat, msg) => {
    var messageObj = {
      sender: user,
      content: msg,
      timestamp: Date.now()
    }
    io.to(chat).emit("chat-message", messageObj)
    chats.doc(chat).update({
      messages: admin.firestore.FieldValue.arrayUnion(messageObj)
    })
  })
  socket.on("leave-chat", (chat) => {
    socket.leave(chat)
  })
})
