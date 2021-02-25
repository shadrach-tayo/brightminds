import { UserType } from '../interfaces/domain.enum';
import bcrypt from 'bcrypt';

export const isEmpty = (value: any): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const isValidUserType = userType => {
  return UserType[userType];
};

export const isPasswordMatching = (password, encryptedPassword) => {
  return bcrypt.compare(password, encryptedPassword);
};

export const hashPassword = (password): Promise<string> => {
  return new Promise(res => {
    res(bcrypt.hash(password, 10));
  });
};

/**
 *
 * @param now current time or time to check with expiry date
 * @param valid_to expiry date of the current subscription
 * @returns {boolean} returns true if valid_to > now i.e the subscription has not expired
 */
export const compareDateFn = (now: string, valid_to: string): boolean => {
  console.log('date > : ', new Date(now).toISOString() > new Date(valid_to).toISOString());
  return new Date(now).toISOString() > new Date(valid_to).toISOString();
};
