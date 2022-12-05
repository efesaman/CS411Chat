const socket = io('http://localhost:3000', { transports : ['websocket'] })
const messageForm = document.getElementById('send-message')
const messageInput = document.getElementById('message-input')

socket.on('chat-msg', data => {
  console.log(data)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const msg = messageInput.value
  socket.emit('send-msg', msg)
  messageInput.value = ''
})
