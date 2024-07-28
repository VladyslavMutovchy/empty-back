import { Server } from 'socket.io';

export const initSocket = (server) => {

  const socketIO = new Server(server);

  const socketUsers = {};

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
      console.log('===REGISTER SOCKET ID', socket.id);
    });

    socket.on('test', (data) => {
      console.log('===CONNECT test', data);
      socket.emit('back-socket', 'Hello socket');
    });

    socket.on('send_message', (message) => {
      const userData = socketUsers[socket.id];
      console.log('===SEND MESSAGE', message);
      const messageData = {
        message,
        ...userData.user,
      };

      Object.values(socketUsers).forEach(userData => {
        userData.socket.emit('get_message', JSON.stringify(messageData));
      });
    });
  });
};