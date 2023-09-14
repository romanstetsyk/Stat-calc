type UserEntityConstructor = {
  id: string;
  name: string;
};

class UserEntity {
  public id: string;
  public name: string;

  public constructor({ id, name }: UserEntityConstructor) {
    this.id = id;
    this.name = name;
  }

  public static create({ id, name }: UserEntityConstructor): UserEntity {
    return new UserEntity({ id, name });
  }
}

export { UserEntity };
