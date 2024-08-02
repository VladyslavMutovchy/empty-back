import Router from 'router';
import ChatAction from '../actions/Chat.js';
import { apiPrivateWrapper } from '../utils/apiWrapper.js';

//initialize router
const userListApi = Router();

// маршрут для получения всех данных
userListApi.route('/api/v1/chat/add').post(apiPrivateWrapper(async (req) => {
  const result = await ChatAction.add(req.userId, req.body.id);
  if (result.error) {
    return {
      status: 'error',
      message: result.error,
      chat_id: result.chat_id,
    };
  }
  return result;
}));


userListApi.route('/api/v1/chat/get-all').get(apiPrivateWrapper(async (req) => {
  return ChatAction.getUserChats(req.userId);
}));

export default userListApi;
