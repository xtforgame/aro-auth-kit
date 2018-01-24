import Sequelize from 'sequelize';

let getAroModelDefs00 = () => ({
  models: {
    users: {
      // tableName: 'tbl_user',
      pAs: ['id', 'username', 'privilege'],
      columns: {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'PrimaryKey',
        },
        username: {
          type: Sequelize.STRING,
          //unique: true,
          comment: 'Username',
        },
        privilege: Sequelize.STRING,
      },
      names: {
        singular: 'user',
        plural: 'users',
      },
      tableOptions: {},
    },
    accountLinks: {
      // tableName: 'tbl_account_link',
      pAs: ['id', 'provider_id', 'provider_user_id'],
      columns: {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'PrimaryKey',
        },
        provider_id: {
          type: Sequelize.STRING,
          //unique: true,
        },
        provider_user_id: {
          type: Sequelize.STRING,
          //unique: true,
        },
        provider_user_access_info: {
          type: Sequelize.JSONB,
          //unique: true,
        },
      },
      names: {
        singular: 'accountLink',
        plural: 'accountLinks',
      },
      tableOptions: {
        indexes: [
          {
            unique: true,
            fields: ['user_id', 'provider_id'],
            where: {
              deleted_at: null,
            },
          },
          {
            unique: true,
            fields: ['provider_id', 'provider_user_id'],
            where: {
              deleted_at: null,
            },
          },
        ],
      },
    },
    characters: {
      // tableName: 'tbl_character',
      pAs: ['id', 'name'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING,
      },
      names: {
        singular: 'character',
        plural: 'characters',
      },
      tableOptions: {},
    },
    videos: {
      // tableName: 'tbl_video',
      pAs: ['id', 'name', 'data'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING,
        data: {type: Sequelize.JSONB},
      },
      names: {
        singular: 'video',
        plural: 'videos',
      },
      tableOptions: {},
    },
    userGroups: {
      pAs: ['id', 'name'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING(900),
      },
      names: {
        singular: 'userGroup',
        plural: 'userGroups',
      },
      tableOptions: {
        instanceMethods: {
          method3: function() {return "instanceMethods";}
        }
      },
    },
    restaurants: {
      // tableName: 'tbl_restaurant',
      pAs: ['id', 'name'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING(900),
      },
      names: {
        singular: 'restaurant',
        plural: 'restaurants',
      },
      tableOptions: {
        instanceMethods: {
          method3: function() {return "instanceMethods";}
        },
        // getterMethods: {
        //   tags: function(){
        //     return "xxxx";
        //   }
        // },
      },
    },
    fnds: {
      // tableName: 'tbl_fnd',
      pAs: ['id', 'name', 'tags'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING(900),
        tags: {type: Sequelize.JSONB},
      },
      names: {
        singular: 'fnd',
        plural: 'fnds',
      },
      tableOptions: {},
    },
    tags: {
      // tableName: 'tbl_tag',
      pAs: ['id', 'name', 'data'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING,
        data: {type: Sequelize.JSONB},
      },
      names: {
        singular: 'tag',
        plural: 'tags',
      },
      tableOptions: {},
    },
    dishes: {
      // tableName: 'tbl_dish',
      pAs: ['id', 'name', 'public', 'apply_state', 'data'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING(900),
        public: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        apply_state: {
          type: Sequelize.INTEGER,
          defaultValue: 0, // 0: 'unapplied', 1: 'applying', 2: 'applied'
        },
        data: {type: Sequelize.JSONB},
      },
      names: {
        singular: 'dish',
        plural: 'dishes',
      },
      tableOptions: {
        instanceMethods: {
          method3: function() {return "instanceMethods";}
        }
      },
    },
    dishInfoNoteRecords: {
      // tableName: 'tbl_dishInfoNoteRecord',
      pAs: ['id', 'type', 'data'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        type: Sequelize.STRING(900),
        data: {type: Sequelize.JSONB},
      },
      names: {
        singular: 'dishInfoNoteRecord',
        plural: 'dishInfoNoteRecords',
      },
      tableOptions: {
        instanceMethods: {
          method3: function() {return "instanceMethods";}
        }
      },
    },
    dishGroups: {
      // tableName: 'tbl_dishGroup',
      pAs: ['id', 'name', 'data'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING(900),
        data: {type: Sequelize.JSONB},
      },
      names: {
        singular: 'dishGroup',
        plural: 'dishGroups',
      },
      tableOptions: {
        instanceMethods: {
          method3: function() {return "instanceMethods";}
        }
      },
    },
    menuPages: {
      pAs: ['id', 'name', 'data'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING(900),
        data: {type: Sequelize.JSONB},
      },
      names: {
        singular: 'menuPage',
        plural: 'menuPages',
      },
      tableOptions: {
        instanceMethods: {
          method3: function() {return "instanceMethods";}
        }
      },
    },
    menus: {
      pAs: ['id', 'name'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING(900),
      },
      names: {
        singular: 'menu',
        plural: 'menus',
      },
      tableOptions: {
        instanceMethods: {
          method3: function() {return "instanceMethods";}
        }
      },
    },
    gameMaps: {
      // tableName: 'tbl_game_map',
      pLas: ['id', 'name'],
      pAs: ['id', 'name', 'data'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING,
        data: {type: Sequelize.JSONB},
      },
      names: {
        singular: 'gameMap',
        plural: 'gameMaps',
      },
      tableOptions: {},
    },
    sessions: {
      // tableName: 'tbl_session',
      pAs: null,
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        token: Sequelize.STRING(900),
        token_type: Sequelize.STRING,
        auth_type: Sequelize.STRING,
        auth_id: Sequelize.STRING,
        userid: Sequelize.BIGINT.UNSIGNED,
        username: Sequelize.STRING,
        expiry_date: Sequelize.DATE,
      },
      names: {
        singular: 'session',
        plural: 'sessions',
      },
      tableOptions: {},
    },
    nearbyRestaurants: {
      // tableName: 'tbl_nearby_restaurant_map',
      pLas: ['id', 'name'],
      pAs: ['id', 'name', 'data'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING,
        data: {type: Sequelize.JSONB},
      },
      names: {
        singular: 'nearbyRestaurant',
        plural: 'nearbyRestaurants',
      },
      tableOptions: {},
    },
    chatMessages: {
      pAs: ['id', 'content'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        content: {type: Sequelize.JSONB},
      },
      names: {
        singular: 'chatMessage',
        plural: 'chatMessages',
      },
      tableOptions: {},
    },
  },
  associationTables: {
    managerRestaurant: {
      pAs: ['type'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        type: Sequelize.STRING,
      },
      names: {
        singular: 'managerRestaurant',
        plural: 'managerRestaurants',
      },
      tableOptions: {},
    },
    followerDish: {
      pAs: ['type'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        type: Sequelize.STRING,
      },
      names: {
        singular: 'followerDish',
        plural: 'followerDishes',
      },
      tableOptions: {},
    },
    userUserGroup: {
      pAs: ['role'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        // user_id: {
        //   type: Sequelize.BIGINT.UNSIGNED,
        //   references: {
        //     model: 'tbl_user',
        //     key: 'id',
        //     deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED,
        //   },
        //   onUpdate: 'CASCADE',
        //   onDelete: 'CASCADE',
        // },
        // user_group_id: {
        //   type: Sequelize.BIGINT.UNSIGNED,
        //   references: {
        //     model: 'tbl_user_group',
        //     key: 'id',
        //     deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED,
        //   },
        //   onUpdate: 'CASCADE',
        //   onDelete: 'CASCADE',
        // },
        role: Sequelize.STRING,
      },
      names: {
        singular: 'userUserGroup',
        plural: 'userUserGroups',
      },
      tableOptions: {},
    },
    groupInvitation: {
      pAs: ['state'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        state: Sequelize.INTEGER,
      },
      names: {
        singular: 'groupInvitation',
        plural: 'groupInvitations',
      },
      tableOptions: {},
    },
  },
  associations: [
    {
      a: {name: 'users', options: {},},
      type: 'hasMany',
      b: {name: 'sessions', options: {},},
    },
    {
      a: {name: 'users', options: {},},
      type: 'hasMany',
      b: {name: 'accountLinks', options: {},},
    },
    {
      a: {name: 'users', options: {foreignKey: 'owner'},},
      type: 'hasMany',
      b: {name: 'characters', options: {foreignKey: 'owner'},},
    },
    {
      a: {name: 'users', options: {as: {singular: 'userGroup', plural: 'userGroups',}},},
      type: 'belongsToMany',
      through: {model: 'userUserGroup'},
      b: {name: 'userGroups', options: {as: {singular: 'member', plural: 'members',}},},
    },
    {
      a: {name: 'users', options: {as: {singular: 'groupInvitation', plural: 'groupInvitations',}},},
      type: 'belongsToMany',
      through: {model: 'groupInvitation'},
      b: {name: 'userGroups', options: {as: {singular: 'invitee', plural: 'invitees',}},},
    },
    {
      a: {name: 'userGroups', options: {},},
      type: 'hasMany',
      b: {name: 'menuPages', options: {},},
    },
    {
      a: {name: 'userGroups', options: {},},
      type: 'hasMany',
      b: {name: 'menus', options: {},},
    },
    {
      a: {name: 'users', options: {as: {singular: 'providedInfo', plural: 'providedInfos',}, foreignKey: 'author_id'},},
      type: 'hasMany',
      b: {name: 'dishInfoNoteRecords', options: {as: {singular: 'author', plural: 'authors',}, foreignKey: 'author_id'},},
    },
    {
      a: {name: 'dishes', options: {as: {singular: 'noteRecord', plural: 'noteRecords',}, foreignKey: 'noteable_id'},},
      type: 'hasMany',
      b: {name: 'dishInfoNoteRecords', options: {as: {singular: 'noteable', plural: 'noteables',}, foreignKey: 'noteable_id'},},
    },
    {
      a: {name: 'userGroups', options: {foreignKey: 'group'},},
      type: 'hasMany',
      b: {name: 'dishInfoNoteRecords', options: {foreignKey: 'group'},},
    },
    {
      a: {name: 'menus', options: {},},
      type: 'belongsToMany',
      b: {name: 'menuPages', options: {},},
    },
    {
      a: {name: 'userGroups', options: {as: {singular: 'ownedDish', plural: 'ownedDishes',}, foreignKey: 'owner_id'}},
      type: 'hasMany',
      b: {name: 'dishes', options: {as: {singular: 'owner', plural: 'owners',}, foreignKey: 'owner_id'}},
    },
    {
      a: {name: 'userGroups', options: {},},
      type: 'hasMany',
      b: {name: 'dishGroups', options: {},},
    },
    {
      a: {name: 'users', options: {as: {singular: 'managedRestaurant', plural: 'managedRestaurants',}},},
      type: 'belongsToMany',
      through: {model: 'managerRestaurant'},
      b: {name: 'restaurants', options: {as: {singular: 'manager', plural: 'managers',}},},
    },
    {
      a: {name: 'users', options: {as: {singular: 'followedRestaurant', plural: 'followedRestaurants',}},},
      type: 'belongsToMany',
      through: 'mn_follower_restaurant',
      b: {name: 'restaurants', options: {as: {singular: 'follower', plural: 'followers',}},},
    },
    {
      a: {name: 'users', options: {as: {singular: 'followedDish', plural: 'followedDishes',}},},
      type: 'belongsToMany',
      through: {model: 'followerDish'},
      b: {name: 'dishes', options: {as: {singular: 'follower', plural: 'followers',}},},
    },
    {
      a: {name: 'restaurants', options: {},},
      type: 'belongsToMany',
      b: {name: 'fnds', options: {},},
    },
    {
      a: {name: 'restaurants', options: {},},
      type: 'belongsToMany',
      b: {name: 'tags', options: {},},
    },
    {
      a: {name: 'users', options: {as: {singular: 'sentChatMessage', plural: 'sentChatMessages',}, foreignKey: 'sender_id'}},
      type: 'hasMany',
      b: {name: 'chatMessages', options: {as: {singular: 'sender', plural: 'senders',}, foreignKey: 'sender_id'}},
    },
    {
      a: {name: 'users', options: {as: {singular: 'receivedChatMessage', plural: 'receivedChatMessages',}, foreignKey: 'receiver_id'}},
      type: 'hasMany',
      b: {name: 'chatMessages', options: {as: {singular: 'receiver', plural: 'receivers',}, foreignKey: 'receiver_id'}},
    },
    {
      a: {name: 'userGroups', options: {as: {singular: 'chatMessage', plural: 'chatMessages',}, foreignKey: 'group_id'}},
      type: 'hasMany',
      b: {name: 'chatMessages', options: {as: {singular: 'group', plural: 'groups',}, foreignKey: 'group_id'}},
    },
  ],
});

let getAroModelDefs01 = () => ({
  models: {
    users: {
      // tableName: 'tbl_user',
      pAs: ['id', 'username', 'privilege'],
      columns: {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'PrimaryKey',
        },
        username: {
          type: Sequelize.STRING,
          //unique: true,
          comment: 'Username',
        },
        privilege: Sequelize.STRING,
      },
      names: {
        singular: 'user',
        plural: 'users',
      },
      tableOptions: {},
    },
    accountLinks: {
      // tableName: 'tbl_account_link',
      pAs: ['id', 'provider_id', 'provider_user_id'],
      columns: {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'PrimaryKey',
        },
        provider_id: {
          type: Sequelize.STRING,
          //unique: true,
        },
        provider_user_id: {
          type: Sequelize.STRING,
          //unique: true,
        },
        provider_user_access_info: {
          type: Sequelize.JSONB,
          //unique: true,
        },
      },
      names: {
        singular: 'accountLink',
        plural: 'accountLinks',
      },
      tableOptions: {
        indexes: [
          {
            unique: true,
            fields: ['user_id', 'provider_id'],
            where: {
              deleted_at: null,
            },
          },
          {
            unique: true,
            fields: ['provider_id', 'provider_user_id'],
            where: {
              deleted_at: null,
            },
          },
        ],
      },
    },
    userGroups: {
      pAs: ['id', 'name'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        name: Sequelize.STRING(900),
      },
      names: {
        singular: 'userGroup',
        plural: 'userGroups',
      },
      tableOptions: {
        instanceMethods: {
          method3: function() {return "instanceMethods";}
        }
      },
    },
    sessions: {
      // tableName: 'tbl_session',
      pAs: null,
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        token: Sequelize.STRING(900),
        token_type: Sequelize.STRING,
        auth_type: Sequelize.STRING,
        auth_id: Sequelize.STRING,
        userid: Sequelize.BIGINT.UNSIGNED,
        username: Sequelize.STRING,
        expiry_date: Sequelize.DATE,
      },
      names: {
        singular: 'session',
        plural: 'sessions',
      },
      tableOptions: {},
    },
  },
  associationTables: {
    userUserGroup: {
      pAs: ['role'],
      columns: {
        id: {type: Sequelize.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
        role: Sequelize.STRING,
      },
      names: {
        singular: 'userUserGroup',
        plural: 'userUserGroups',
      },
      tableOptions: {},
    },
  },
  associations: [
    {
      a: {name: 'users', options: {},},
      type: 'hasMany',
      b: {name: 'sessions', options: {},},
    },
    {
      a: {name: 'users', options: {},},
      type: 'hasMany',
      b: {name: 'accountLinks', options: {},},
    },
    {
      a: {name: 'users', options: {as: {singular: 'userGroup', plural: 'userGroups',}},},
      type: 'belongsToMany',
      through: {model: 'userUserGroup'},
      b: {name: 'userGroups', options: {as: {singular: 'member', plural: 'members',}},},
    },
  ],
});

let getAroModelDefs02 = () => ({
  models: {
    users: {
      // tableName: 'tbl_user',
      pAs: ['id', 'username', 'privilege'],
      columns: {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'PrimaryKey',
        },
        username: {
          type: Sequelize.STRING,
          //unique: true,
          comment: 'Username',
        },
        privilege: Sequelize.STRING,
      },
      names: {
        singular: 'user',
        plural: 'users',
      },
      tableOptions: {},
    },
    accountLinks: {
      // tableName: 'tbl_account_link',
      pAs: ['id', 'provider_id', 'provider_user_id'],
      columns: {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          comment: 'PrimaryKey',
        },
        provider_id: {
          type: Sequelize.STRING,
          //unique: true,
        },
        provider_user_id: {
          type: Sequelize.STRING,
          //unique: true,
        },
        provider_user_access_info: {
          type: Sequelize.JSONB,
          //unique: true,
        },
      },
      names: {
        singular: 'accountLink',
        plural: 'accountLinks',
      },
      tableOptions: {},
    },
  },
  associationTables: {
  },
  associations: [
    {
      a: {name: 'users', options: {},},
      type: 'hasMany',
      b: {name: 'accountLinks', options: {},},
    },
  ],
});

export {
  getAroModelDefs00,
  getAroModelDefs01,
  getAroModelDefs02,
};
