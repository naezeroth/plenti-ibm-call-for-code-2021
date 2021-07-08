main = (params) => {
  const bcrypt = require("bcryptjs");
  if (!params.name || !params.email || !params.password) {
    return {
      error: "payload must have email, password and name",
    };
  }
  const hashedPassword = bcrypt.hashSync(params.password, 8);
  return {
    doc: {
      createdAt: new Date(),
      name: params.name,
      email: params.email,
      password: hashedPassword,
    },
  };
};

global.main = main;
