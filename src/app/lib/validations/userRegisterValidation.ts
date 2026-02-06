interface UserCredentials {
  email: string;
  username: string;
  password: string;
}

const config = {
  email: {
    regEx: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  username: {
    minLength: 5,
    maxLength: 13,
    regEx: /^^[a-zA-Z0-9_.]+$/,
  },
  password: {
    minLength: 6,
    maxLength: 25,
  },
};

export default function userRegisterValidation(
  userCredentials: UserCredentials
) {
  const regEx = /^^[a-zA-Z0-9_.]+$/;
  const errors: string[] = [];

  if (!userCredentials.email || userCredentials.email.trim() === "") {
    errors.push("A valid email is required.");
  }

  if (
    !userCredentials.username ||
    userCredentials.username.trim().length < config.username.minLength ||
    userCredentials.username.trim().length > config.username.maxLength ||
    userCredentials.username.trim().includes(" ") ||
    regEx.test(userCredentials.email.trim())
  ) {
    errors.push("A valid username is required.");
  }

  if (
    !userCredentials.password ||
    userCredentials.password.trim().length < config.password.minLength ||
    userCredentials.password.trim().length > config.password.maxLength
  ) {
    errors.push("A valid password is required.");
  }

  return { valid: errors.length === 0, errors };
}
