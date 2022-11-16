const path = require("path");
const getEnvironmentPath = () => {
  const environment = process.env.NODE_ENV;
  const environmentMap = {
    production: ".env.production",
    development: ".env.development",
  };
  return path.join(
    __dirname + "/../../",
    environmentMap[environment] || ".env"
  );
};

module.exports = { getEnvironmentPath };
