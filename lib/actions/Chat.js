class UserListAction {
  addUserToChat = (userId, chatId) =>{
    const addUserToChatQuery = `INSERT INTO chat_users SET chat_id = ?, user_id = ?`;
    return global.dbConnection.runQuery(addUserToChatQuery, [chatId, userId]);
  };

  async add(firstUserId, secondUserId) {
    const getAllUsersQuery = `INSERT INTO chats () VALUES ()`;
    const result = await global.dbConnection.runQuery(getAllUsersQuery);
    const chatId = result.insertId;
    await this.addUserToChat(firstUserId, chatId);
    await this.addUserToChat(secondUserId, chatId);
    return {
      chat_id: chatId,
      user_id: secondUserId,
    };
  }

  async getUserChats(userId) {
    const getChatsQuery = `
      SELECT cu.chat_id,
      JSON_ARRAYAGG(JSON_OBJECT('id', cu2.user_id, 'email', u.email)) AS chat_users
      FROM chat_users AS cu
      LEFT JOIN chat_users AS cu2 ON cu2.chat_id = cu.chat_id AND cu2.user_id != ?
      LEFT JOIN users AS u ON u.id = cu2.user_id
      WHERE cu.user_id = ?
      GROUP BY cu.chat_id
    `;

    const chatsData = await global.dbConnection.runQuery(getChatsQuery, [userId, userId]);

    chatsData.forEach(chatData => {
      chatData.chat_users = JSON.parse(chatData.chat_users);
    });

    return chatsData;
  }
}

export default new UserListAction();
