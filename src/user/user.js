
class User {
  name = "User";
  password = "Password";
  email = "Email";
  phone = "Phone";

  services = [];

  // ---

  constructor({ name, password, email, phone, services }) {
    name && (this.name = name);
    password && (this.password = password);
    email && (this.email = email);
    phone && (this.phone = phone);

    services && (this.services = services);
  }

  // ---

  static async create({ name, password, email, phone, services }) {
    
  }
}