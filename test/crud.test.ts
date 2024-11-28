import { describe, it, expect, beforeAll } from 'vitest';
import { UserEntity } from './UserEntity'; 
import { getAllCollections, initTests } from './initTests';
import { doc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';

describe('CRUD operations', () => {
  
  beforeAll(() => {
    initTests();
  });

  it('should create a user', async () => {
    const username = 'Alice Dupond'
    
    const user = new UserEntity();
    user.data.username = username
    await user.save();
    
    const { userCollection } = getAllCollections()
    const savedUser = await userCollection.getById(user.getId()!);
    expect(savedUser).toBeDefined();
    expect(savedUser?.data.username).toBe(username);
  });
  
  it('should create a user and verify with firebase api', async () => {
    const username = 'Alice Dupond';
    
    const user = new UserEntity();
    user.data.username = username;
    await user.save();
    
    const { userCollection } = getAllCollections()
    const docRef = doc(userCollection.firestoreCollectionReference, user.getId()!)
    expect(docRef).toBeDefined();
    
    const docSnap = await getDoc(docRef!);
    expect(docSnap.exists()).toBe(true);
    expect(docSnap.data()!.username).toBe(username);
  });
  
  it('should create a user, update it and verify with firebase api', async () => {
    const username = 'Alice Dupond';
    
    const user = new UserEntity();
    user.data.username = username;
    await user.save();
    
    const { userCollection } = getAllCollections()
    const docRef = doc(userCollection.firestoreCollectionReference, user.getId()!)
    expect(docRef).toBeDefined();
    
    const docSnap = await getDoc(docRef!);
    expect(docSnap.exists()).toBe(true);
    expect(docSnap.data()!.username).toBe(username);

    // Update username
    const newUsername = 'Alice Martin';
    user.data.username = newUsername;
    await user.save();

    // Verify update with Firebase API
    const updatedDocSnap = await getDoc(docRef!);
    expect(updatedDocSnap.exists()).toBe(true);
    expect(updatedDocSnap.data()!.username).toBe(newUsername);
  });
  
  it('should create a user, delete it and verify with firebase api', async () => {
    const username = 'Bob Smith';
    
    const user = new UserEntity();
    user.data.username = username;
    await user.save();
    
    const { userCollection } = getAllCollections()
    const docRef = doc(userCollection.firestoreCollectionReference, user.getId()!)
    expect(docRef).toBeDefined();
    
    // Verify user was created
    const docSnap = await getDoc(docRef!);
    expect(docSnap.exists()).toBe(true);
    expect(docSnap.data()!.username).toBe(username);

    // Delete user
    await user.delete();

    // Verify deletion with Firebase API
    const deletedDocSnap = await getDoc(docRef!);
    expect(deletedDocSnap.exists()).toBe(false);
    
    // Try to delete again - should throw error
    await expect(user.delete()).rejects.toThrow('Entity deleted');
  });

});
