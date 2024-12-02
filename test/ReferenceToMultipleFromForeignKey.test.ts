import { describe, it, expect, beforeEach } from 'vitest';
import { initTests, getAllCollections } from './initTests';

describe('ReferenceToMultipleFromForeignKey', () => {
  beforeEach(() => {
    initTests();
  });

  it('should create user, multiple comments and retrieve comments through reference', async () => {
    const { userCollection, commentCollection } = getAllCollections();

    // Create a user
    const user = await userCollection.create({
      username: 'John Doe',
      group_ids: []
    });

    // Create multiple comments
    const comment1 = await commentCollection.create({
      text: 'First comment',
      datetime: new Date().toISOString(),
      user_author_id: user.getId()
    });

    const comment2 = await commentCollection.create({
      text: 'Second comment',
      datetime: new Date().toISOString(),
      user_author_id: user.getId()
    });

    // Get the comments through user's reference
    const userComments = await user.comments.getEntities();

    // Verify the comments are correctly retrieved
    expect(userComments).toBeDefined();
    expect(userComments.length).toBe(2);
    expect(userComments.map(c => c.data.text).sort()).toEqual(['First comment', 'Second comment'].sort());
    expect(userComments.map(c => c.getId()).sort()).toEqual([comment1.getId(), comment2.getId()].sort());
  });
});
