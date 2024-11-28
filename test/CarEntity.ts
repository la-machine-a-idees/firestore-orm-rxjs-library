import { Entity, oneReference } from '../src';
import { z } from 'zod';
import { UserEntity } from './UserEntity';

const schema = z.object({
  model: z.string(),
  user_owner_id: oneReference,
});

export class CarEntity extends Entity<z.infer<typeof schema>> {
  constructor() {
    super('cars', schema, { model: 'Unknown' });
  }
  
  owner = this.referencesToOne<UserEntity>('users').fromKey('user_owner_id')
}
