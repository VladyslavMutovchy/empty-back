class UserListAction {
  addUserToChat = (userId, chatId) => {
    const addUserToChatQuery = `INSERT INTO chat_users (chat_id, user_id) VALUES (?, ?)`;
    return global.dbConnection.runQuery(addUserToChatQuery, [chatId, userId]);
  };

  async add(firstUserId, secondUserId) {
    const checkExistingChatQuery = `
      SELECT chat_id
      FROM chat_users
      WHERE chat_id IN (
        SELECT chat_id
        FROM chat_users
        WHERE user_id = ?
      )
      AND user_id = ?
    `;

    const existingChat = await global.dbConnection.runQuery(checkExistingChatQuery, [firstUserId, secondUserId]);

    if (existingChat.length > 0) {
      return { error: 'Chat already exists', chat_id: existingChat[0].chat_id };
    }

    const createChatQuery = `INSERT INTO chats () VALUES ()`;
    const result = await global.dbConnection.runQuery(createChatQuery);
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
