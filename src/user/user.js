const { ifAddAll } = require("../blocks/ifadd");

class User {
  name = "User";
  password = "Password";
  email = "Email";
  phone = "Phone";

  services = [];

  // ---

  constructor({ name, password, email, phone, services }) {
    ifAddAll(this, { name, password, email, phone, services });
  }

  // ---

  static async create({ name, password, email, phone, services }) {}
}
