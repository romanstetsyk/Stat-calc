import type { UserInfo } from 'shared/build/index.js';

type UserEntityConstructor = UserInfo & {
  id: string;
  passwordHash: string;
};

class UserEntity {
  public id: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public passwordHash: string;

  public constructor({
    id,
    firstName,
    lastName,
    email,
    passwordHash,
  }: UserEntityConstructor) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  public static create({
    id,
    firstName,
    lastName,
    email,
    passwordHash,
  }: UserEntityConstructor): UserEntity {
    return new UserEntity({ id, firstName, lastName, email, passwordHash });
  }

  public static createObject({
    firstName,
    lastName,
    email,
    passwordHash,
  }: Omit<UserEntityConstructor, 'id'>): UserInfo &
    Pick<UserEntity, 'passwordHash'> {
    return {
      firstName,
      lastName,
      email,
      passwordHash,
    };
  }

  public toObject(): UserInfo {
    const { firstName, lastName, email } = this;
    return { firstName, lastName, email };
  }
}

export { UserEntity };
