import Realm, {ObjectSchema} from 'realm';

export type UserType = 'Admin' | 'Manager';

export class User extends Realm.Object<User> {
  id!: string;
  name!: string;
  email?: string;
  type!: UserType;

  static schema: ObjectSchema = {
    name: 'User',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      email: 'string?',
      type: 'string',
    },
  };
}

export const getRealm = async () => {
  return await Realm.open({
    schema: [User],
    schemaVersion: 1,
  });
};
