import { Entity, oneReference } from '../src';
import { z } from 'zod';
import { HouseEntity } from './HouseEntity';

const schema = z.object({
  username: z.string(),
  house_id: oneReference,
});

export class UserEntity extends Entity<z.infer<typeof schema>> {
    
  constructor() {
    super('users', schema, { username: 'No name' });
  }
}
