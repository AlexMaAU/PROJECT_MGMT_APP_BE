const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
});

const ClientModel = mongoose.model("Client", ClientSchema);

module.exports = ClientModel;
