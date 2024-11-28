import { Entity } from '../src';
import { z } from 'zod';

const schema = z.object({
  address: z.string(),
  city: z.string(),
});

export class FamilyEntity extends Entity<z.infer<typeof schema>> {
  constructor() {
    super('families', schema, { address: '', city: '' });
  }
}