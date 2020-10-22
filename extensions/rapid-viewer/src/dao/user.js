class User {
  constructor(
    xnatUrl,
    username,
    email,
    firstName,
    lastName,
    token,
    tokenSecret,
    expireAt,
    loggedInAt
  ) {
    this.xnatUrl = xnatUrl;
    this.username = username;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.token = token;
    this.tokenSecret = tokenSecret;
    this.expireAt = expireAt;
    this.loggedInAt = loggedInAt;
  }

  get expired() {
    if (!this.token) {
      return true;
    }
    if (!this.expireAt || isNaN(this.expireAt)) {
      return true;
    }
    return this.expireAt < Date.now();
  }
}

export default User;
