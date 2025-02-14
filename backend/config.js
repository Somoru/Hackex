require("dotenv").config();

module.exports = {
    mongoURI: process.env.MONGO_URI,
    aciExecutorURL: process.env.ACI_EXECUTOR_URL,
    port: process.env.PORT || 5000
};
