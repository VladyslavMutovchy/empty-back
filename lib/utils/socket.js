import _ from 'lodash';

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

      console.log('===CHANT CONNECT USER ID', userId);

      chatIds.forEach((chatId) => {
        if (!chatConnections[chatId]) {
          chatConnections[chatId] = {};
        }
        chatConnections[chatId][userId] = socketUsers[socket.id]?.socket;
      });

      console.log('===CONNECT CHAT', chatConnections);
    });

    socket.on('send_message', (messageDataJSON) => {
      const userData = socketUsers[socket.id];
      // console.log('===userData', userData);
      const messageData = JSON.parse(messageDataJSON);
      messageData.user_id = userData.user.id;
      console.log('===SEND MESSAGE', messageData);

      // const messageData = {
      //   message,
      //   ...userData.user,
      // };

      chatConnections[messageData.chat_id];

      console.log('===messageData.chat_id', messageData.chat_id);
      // console.log('===chatConnections', chatConnections);
      console.log(
        '===chatConnections[messageData.chat_id]',
        chatConnections[messageData.chat_id],
      );

      _.forEach(chatConnections[messageData.chat_id], (socket) => {
        socket.emit('get_message', JSON.stringify(messageData));
      });
    });

    socket.on('typing_status', (typingDataJSON) => {
  const typingData = JSON.parse(typingDataJSON);
  _.forEach(chatConnections[typingData.chatId], (socket) => {
    if (socket.id !== socketUsers[typingData.userId]?.socket.id) {
      socket.emit('typing_status', JSON.stringify(typingData));
    }
  });
});

  });
};
