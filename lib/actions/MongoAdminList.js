import { ObjectId } from "mongodb";

class MongoAdminListAction {
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

  // Получение всех документов из 'admin-list' с навыками из 'admin-list-skills'
  async getAll( start, limit, search, filter_by, sort_by, sort_direction ) {
    console.log('final======>',start, limit, search , filter_by, sort_by, sort_direction);
    const searchPattern = new RegExp(search, 'i');
    let matchStage = {};
    let sortStage;

    switch (sort_direction) {
      case 'DESC':
        sortStage = { [sort_by]: -1 };
        break;
      case 'ASC':
        sortStage = { [sort_by]: 1 };
        break;
      default:
        sortStage = { [sort_by]: 1 }; // Установка по умолчанию (например, по возрастанию)
    }
    //  = { [sort_by]: sort_direction === 'ASC' ? 1 : -1 };

    // Построение условий поиска
  // Настройка фильтрации поиска
  if (search) {
    if (filter_by === 'skills') {
      matchStage['skills.skill'] = searchPattern;
    } else if (filter_by !== 'all') {
      matchStage[filter_by] = searchPattern;
    } else {
      matchStage['$or'] = [
        { '_id': searchPattern },
        { 'name': searchPattern },
        { 'age': searchPattern },
        { 'skills.skill': searchPattern }
      ];
    }
  }

    // Агрегатный запрос
    const datum = await global.mongoConnection.aggregate('admin-list', [
      { $match: matchStage },
      {
        $lookup: {
          from: 'admin-list-skills',
          localField: '_id',
          foreignField: 'id_datum',
          as: 'skills',
        },
      },
      { $sort: sortStage },
      { $skip: start },
      { $limit: limit },
    ]);

    datum.forEach((data) => {
      data.id = data._id; // Преобразуем ObjectId в строку для удобства
      data.skills.forEach((skill) => {
        skill.skill_id = skill._id; // Преобразуем ObjectId навыка
      });
    });

    // Получение общего количества записей для пагинации
    const totalQuantity = await global.mongoConnection.aggregate('admin-list', [
      { $match: matchStage },
      { $count: 'total' },
    ]);

    return { records: datum, total: (totalQuantity[0] && totalQuantity[0].total) || 0 };
  }
  async deleteAll() {
    await global.mongoConnection.deleteMany('admin-list', {});
    await global.mongoConnection.deleteMany('admin-list-skills', {});
  }
}

export default new MongoAdminListAction();
