module.exports = class UserDto {
  name;
  email;
  id;
  isActivated;
  role;
  phone;
  address;

  constructor(model) {
    this.id = model.id;
    this.name = model.name;
    this.email = model.email;
    this.role = model.role;
    this.isActivated = model.isActivated;
    this.phone = model.phone;
    this.address = model.address;
  }
}
