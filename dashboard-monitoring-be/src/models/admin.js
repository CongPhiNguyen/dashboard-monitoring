const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    salt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("admin", AdminSchema);
module.exports = Admin;
