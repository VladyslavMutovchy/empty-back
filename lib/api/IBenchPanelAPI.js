import Router from 'router';
import IBenchPanelAction from '../actions/IBenchPanel.js';




const iBenchPanelAPI = Router();

iBenchPanelAPI.route('/api/v1/project/add').post(async (req, res) => {
  try {
    const result = await IBenchPanelAction.add(req.body);
    const data = {
      ...req.body,
    };
    res.end(JSON.stringify(data, result));
  } catch (e) {
    console.log('Error adding data', e);
  }

  
});

iBenchPanelAPI.route('/api/v1/project/getAll').get(async (req, res) => {
  try {
    const result = await IBenchPanelAction.getAll();
    console.log('ROUTE:Fetched all data:', result); // Log the result
    res.end(JSON.stringify(result));
  } catch (e) {
    console.log('Error getting all data', e);
  }
});


export default iBenchPanelAPI;
