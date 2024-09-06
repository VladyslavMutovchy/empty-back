import { ObjectId } from "mongodb";

class AdminListAction {
  addMongoDB(data) {
    data.age = +data.age;
    return global.mongoConnection.insertOne('admin-list', data);
  }

  addSkillMongoDB(data) {
    data.id_datum = new ObjectId(data.id_datum);
    return global.mongoConnection.insertOne('admin-list-skills', data);
  }

  async deleteSkillById(id) {
    console.log('Attempting to delete skill with ID:', id);
    return global.mongoConnection.deleteById('admin-list-skills', id);
  }

  async deleteById(_id) {
    console.log('Attempting to delete user with ID:', _id);
    await global.mongoConnection.deleteById('admin-list', _id);
    await global.mongoConnection.delete('admin-list-skills', { id_datum: new ObjectId(_id) });


    // await global.mongoConnection.deleteById('admin-list', 'admin-list-skills', id);
  }


  updateMongoDB(_id, data) {
    return global.mongoConnection.updateById('admin-list', _id, data);
  }

  updateSkillMongoDB(_id, data) {
    return global.mongoConnection.updateById('admin-list-skills', _id, data);
  }

  async getAll() {
    const datum = await global.mongoConnection.aggregate('admin-list', [{
      $lookup: {
        from: 'admin-list-skills',
        localField: '_id',
        foreignField: 'id_datum',
        as: 'skills',
      },
    }]);

    datum.forEach((data) => {
      data.id = data._id;

      data.skills.forEach(skill => {
        skill.skill_id = skill._id;
      })
    });

    return datum;
  }
}

export default new AdminListAction();
