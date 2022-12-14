# cnm-mechat-socket

- Trong thư mục project, bạn có thể chạy bằng lệnh:

## npm start

Để khởi chạy server socket-io.

# Usage

## # 1: Xử lý user đang online/ offline

- Client:

```python
  # send from client to server (userId)
  socket.current.emit('addUser', user._id);

  # receiver and get users online
  socket.current.on('getUsers', (users) => {
    console.log('USER - ONLINE -', users);
    # code here ...
  });
```

- Server:

```python
  # get userId && socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    # get users when online
    io.emit("getUsers", users);
  });
```

## # 2: Xử lý gửi và nhận tin nhắn (real time)

- Client:

```python
  # send message with socket to server
  socket.current.emit('sendMessage', {
    senderID: user._id,
    receiverID: receiverID,
    content: newMessage,
  });

  # get message
  socket.current.on('getMessage', (data) => {
    setArrivalMessage({
      senderID: data.senderID,
      content: data.content,
      createdAt: Date.now(),
    });
  });
```

- Server:

```python
  # receiver from client and send message to server
  socket.on("sendMessage", ({ senderID, receiverID, content }) => {
    const user = getUser(receiverID);

    # send message to client (user by socketId)
    io.to(user.socketId).emit("getMessage", {
      senderID,
      content,
    });
  });
```
