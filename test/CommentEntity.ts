import { Entity, oneReference } from '../src';
import { UserEntity } from './UserEntity';
import { z } from 'zod';

const schema = z.object({
  datetime: z.string().datetime(),
  text: z.string(),
  user_author_id: oneReference,
});

export class CommentEntity extends Entity<z.infer<typeof schema>> {
  constructor() {
    super('comments', schema, { datetime: new Date().toISOString(), text: '', user_author_id: '' });
  }

  author = this.referencesToOne<UserEntity>('users').fromKey('user_author_id');
} 