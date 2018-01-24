import Sequelize from 'sequelize';
import {sha512gen_salt, crypt} from '../../src/library/utils/crypt';

let getUserSubmodels = () => ([
  {
    model: 'accountLinks',
    value: ({parent: {result: user}}) => {
      let username = user.dataValues.name;
      return {
        provider_id: 'basic',
        provider_user_id: username,
        provider_user_access_info: {
          password: crypt(username, sha512gen_salt()),
        },
      };
    },
  },
]);

function createTestUser(resourceManager){
  let userModel = resourceManager.getModel('users');
  let userGroupModel = resourceManager.getModel('userGroups');
  let sharedDishes = []
  return userModel.table.findAll({
    attributes: [[Sequelize.fn('COUNT', Sequelize.col('name')), 'usercount']],
  })
  .then((users) => {
    if(users[0].dataValues.usercount == 0){
      return userModel.createEx([{
        value: {
          name: 'admin',
          privilege: 'admin',
        },
        submodels: getUserSubmodels(),
      }])
      .then(() => userModel.createEx([{
        value: {
          name: 'world',
          privilege: 'world',
        },
        submodels: getUserSubmodels(),
      }]))
      .then(() => userModel.createEx([{
        value: {
          name: 'user01',
          privilege: 'user',
        },
        submodels: getUserSubmodels(),
      }, {
        value: {
          name: 'user02',
          privilege: 'user',
          labels: {bot: 'xxx'},
        },
        submodels: getUserSubmodels(),
      }]))
      .then(() => userModel.createEx([{
        value: {
          name: 'user03',
          privilege: 'user',
        },
        submodels: getUserSubmodels(),
      }]));
    }
    return Promise.resolve(null);
  });
}

export default function createTestData(resourceManager, ignore = false){
  if(ignore){
    return Promise.resolve(true);
  }
  return createTestUser(resourceManager);
}
