export class CorsException extends Error {
  constructor() {
    super('XNAT blocks the CORS request. Please contact XNAT admin.');
  }
}

export class UserExpiredException extends Error {
  constructor() {
    super('User Expired');
  }
}

export class HttpException extends Error {
  constructor(status, statusText, body = undefined) {
    super(`[${status}]${statusText}`);
    this.body = body;
  }
}

export class PageNotFoundException extends Error {
  constructor() {
    super('Page Not Found');
  }
}

export class BadCredentialException extends Error {
  constructor(message = 'Bad credential entered', body = undefined) {
    super(message);
    this.body = body;
  }
}
