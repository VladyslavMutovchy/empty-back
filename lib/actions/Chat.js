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
    const getChatsQuery = `SELECT cu.chat_id, (
        SELECT GROUP_CONCAT(cu2.user_id SEPARATOR ', ') AS chat_users
        FROM chat_users AS cu2 
        WHERE cu2.chat_id = cu.chat_id AND cu2.user_id != ? 
        GROUP BY user_id
      ) AS chat_users
      FROM chat_users AS cu WHERE cu.user_id = ?
    `;

    const chatsData = await global.dbConnection.runQuery(getChatsQuery, [userId, userId]);

    return chatsData;

    const users = chatsData.map((chatData) => chatData.chat_users.join(', '));

    const getChatUsers = `SELECT * FROM users WHERE id IN (${users})`;
    const usersData = await global.dbConnection.runQuery(getChatUsers);

    const getChatUsersQuery = ``;
  }
}

export default new UserListAction();
