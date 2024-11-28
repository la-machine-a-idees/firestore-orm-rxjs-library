import { Entity, oneReference } from '../src';
import { z } from 'zod';
import { FamilyEntity } from './FamilyEntity';

const schema = z.object({
  username: z.string(),
  family_id: oneReference,
});

export class UserEntity extends Entity<z.infer<typeof schema>> {
    
  constructor() {
    super('users', schema, { username: 'No name' });
  }
  
  family = this.referencesToOne<FamilyEntity>('families').fromKey('family_id');
}
