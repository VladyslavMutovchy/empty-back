import Router from 'router';
import IBenchPanelAction from '../actions/IBenchPanel.js';



const iBenchPanelAPI = Router();

iBenchPanelAPI.route('/api/v1/project/add').post(async (req, res) => {
  try {
    const result = await IBenchPanelAction.add(req.body);
    console.log('Add Works', req.body);
    const data = {
      ...req.body,
    };
    res.end(JSON.stringify(data, result));
  } catch (e) {
    console.log('Error adding data', e);
  }
});


export default IBenchPanelAction;
