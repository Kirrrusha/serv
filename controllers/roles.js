const AccessControl = require('accesscontrol');
let grantsObject = {
  supervisor: {
    profile: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*']
    }
  },
  admin: {
    profile: {
      'create:own': ['*'],
      'read:any': ['*'],
      'update:own': ['*'],
      'delete:own': ['*']
    }
  },
  basic: {
    profile: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*']
    }
  }
};

const ac = new AccessControl(grantsObject);

exports.roles = ac;