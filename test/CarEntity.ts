import { Entity, oneReference } from '../src';
import { z } from 'zod';

const schema = z.object({
  model: z.string(),
  user_owner_id: oneReference,
});

export class CarEntity extends Entity<z.infer<typeof schema>> {
  constructor() {
    super('cars', schema, { model: 'Unknown' });
  }
}
