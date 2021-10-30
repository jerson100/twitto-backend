const REGEX = {
  OBJECT_ID: /^[a-f\d]{24}$/i,
  user: {
    username: /^[a-z0-9]{8,15}$/i,
    password:
      /(?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*[$@$!%*?&#.$($)$-$_])^[a-z\dA-Z[$@$!%*?&#.$($)$-$_\]]{12,20}$/,
  },
};

const USERS_TYPE = {
  ADMINISTRATOR: "ADM",
  USUARIO_COMUN: "US",
  MODERADOR: "MOD",
};

const ACCOUNTS_STATE = {
  ACTIVE: 1,
  SUSPENDED: 2,
  REMOVED: 3,
};

const FOLLOWING_STATE = {
  ACTIVE: 1,
  REMOVED: 2,
};

module.exports = {
  REGEX,
  USERS_TYPE,
  ACCOUNTS_STATE,
  FOLLOWING_STATE,
};
