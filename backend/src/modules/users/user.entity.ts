type UserEntityConstructor = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

class UserEntity {
  public id: string;
  public name: string;
  public email: string;
  public passwordHash: string;

  public constructor({ id, name, email, passwordHash }: UserEntityConstructor) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  public static create({
    id,
    name,
    email,
    passwordHash,
  }: UserEntityConstructor): UserEntity {
    return new UserEntity({ id, name, email, passwordHash });
  }

  public static createObject({
    name,
    email,
    passwordHash,
  }: Omit<UserEntityConstructor, 'id'>): Omit<UserEntity, 'id'> {
    return {
      name,
      email,
      passwordHash,
    };
  }
}

export { UserEntity };
