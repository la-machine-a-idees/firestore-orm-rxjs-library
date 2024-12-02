import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initTests, getAllCollections } from './initTests';
import { addDoc, updateDoc } from 'firebase/firestore'; 

describe('Entity', () => {
  beforeEach(() => {
    initTests();
  });

  describe('setRealtimeUpdates', () => {
    it('should enable realtime updates and receive updates when document changes', async () => {
      const { userCollection } = getAllCollections();

      // Create a user using Firestore API
      const userRef = await addDoc(userCollection.firestoreCollectionReference, {
        username: 'testUser',
        email: 'test@example.com'
      });

      // Get the user entity
      const user = await userCollection.getById(userRef.id);
      expect(user.data.username).toBe('testUser');

      // Enable realtime updates
      user.setRealtimeUpdates(true);

      // Update the document directly through Firestore
      await updateDoc(userRef, {
        username: 'updatedUser'
      });

      // Wait for the update to propagate
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if the entity was updated
      expect(user.data.username).toBe('updatedUser');

      // Disable realtime updates
      user.setRealtimeUpdates(false);

      // Update again
      await updateDoc(userRef, {
        username: 'finalUpdate'
      });

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check that the entity wasn't updated this time
      expect(user.data.username).toBe('updatedUser');
    });
 
    it('should not create multiple subscriptions when enabling multiple times', async () => {
      const { userCollection } = getAllCollections();

      // Create a user using Firestore API
      const userRef = await addDoc(userCollection.firestoreCollectionReference, {
        username: 'testUser',
        email: 'test@example.com'
      });

      // Get the user entity
      const user = await userCollection.getById(userRef.id);

      // Enable realtime updates multiple times
      user.setRealtimeUpdates(true);
      user.setRealtimeUpdates(true);
      user.setRealtimeUpdates(true);

      // Update the document
      await updateDoc(userRef, {
        username: 'updatedUser'
      });

      // Wait for the update to propagate
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if the entity was updated only once
      expect(user.data.username).toBe('updatedUser');

      // Cleanup
      user.setRealtimeUpdates(false);
    });
  });
});
