import { Server } from 'socket.io';

export const initSocket = (server) => {

  const socketIO = new Server(server);

  const socketUsers = {};
  const chatConnections = {};
  
  socketIO.on('connection', (socket) => {
    console.log('===CONNECT', socket.id);

    socket.on('disconnect', () => {
      delete socketUsers[socket.id];
      console.log('===disconnect', socketUsers);
    });

    socket.on('register', (data) => {
      const userData = JSON.parse(data);
      socketUsers[socket.id] = {
        user: userData,
        socket,
      };
      console.log('===REGISTER SOCKET ID', socket.id, userData);
    });

    socket.on('chat_connect', (chatIdsJSON) => {
      const chatIds = JSON.parse(chatIdsJSON);
      console.log('===chatIds', chatIds);

      const userId = socketUsers[socket.id]?.user?.id;

      chatIds.forEach(chatId => {
        chatConnections[chatId] = { [userId]: socketUsers[socket.id]?.socket };
      });

      console.log('===chatConnections', chatConnections);
    });

    socket.on('send_message', (messageDataJSON) => {
      const userData = socketUsers[socket.id];
      console.log('===SEND MESSAGE', userData);
      const messageData = JSON.parse(messageDataJSON);
      // const messageData = {
      //   message,
      //   ...userData.user,
      // };

      Object.values(socketUsers).forEach(userData => {
        userData.socket.emit('get_message', JSON.stringify(messageData));
      });
    });
  });
};