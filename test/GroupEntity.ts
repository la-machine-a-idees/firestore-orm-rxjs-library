import { Entity } from '../src';
import { z } from 'zod';
import { UserEntity } from './UserEntity';

const schema = z.object({
  name: z.string(),
});

export class GroupEntity extends Entity<z.infer<typeof schema>> {
  constructor() {
    super('groups', schema, { name: 'No name' });
  }

  users = this.referencesToMultiple<UserEntity>('users').fromForeignArrayKey('group_ids');
}
