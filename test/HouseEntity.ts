import { Entity } from '../src';
import { z } from 'zod';

const schema = z.object({
  address: z.string(),
  city: z.string(),
});

export class HouseEntity extends Entity<z.infer<typeof schema>> {
  constructor() {
    super('houses', schema, { address: '', city: '' });
  }
} 