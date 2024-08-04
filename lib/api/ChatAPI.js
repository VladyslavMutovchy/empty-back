import Router from 'router';
import ChatAction from '../actions/Chat.js';
import { apiPrivateWrapper } from '../utils/apiWrapper.js';

//initialize router
const userListApi = Router();

// маршрут для получения всех данных
userListApi.route('/api/v1/chat/add').post(apiPrivateWrapper(async (req) => {
  const result = await ChatAction.add(req.userId, req.body.id);
  if (result.error) {
    throw(result.error);
    // return {
    //   status: 'error',
    //   message: result.error,
    //   chat_id: result.chat_id,
    // };
  }
  return result;
}));

userListApi.route('/api/v1/chat/get-all').get(apiPrivateWrapper(async (req) => {
  return ChatAction.getUserChats(req.userId);
}));

userListApi.route('/api/v1/messages/get-messages').get(apiPrivateWrapper(async (req, res) => {
  const chat_id = req.query.chat_id;

  if (!chat_id) {
    return global.responses.errorResponse(res, 'chat_id is required');
  }

  return ChatAction.getMessages(chat_id);
}));

userListApi.route('/api/v1/messages/send-message').post(apiPrivateWrapper(async (req, res) => {
  const { chat_id, message } = req.body;

  if (!chat_id || !message) {
    console.error('Missing required fields:', { chat_id, message });

    return {
      status: 400,
      json: { error: "chat_id, message, and user_id are required" }
    };
  }

  try {
    const result = await ChatAction.sendMessage(chat_id, message, req.userId);
    return {
      status: 200,
      json: result
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      status: 500,
      json: { error: "Internal server error" }
    };
  }
}));



export default userListApi;
