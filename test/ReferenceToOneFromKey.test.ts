import { describe, it, expect, beforeEach } from 'vitest';
import { initTests, getAllCollections } from './initTests';
import { addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';

describe('ReferenceToOneFromKey', () => {
  beforeEach(() => {
    initTests();
  });

  it('should create family, user with family_id and retrieve family through reference', async () => {
    const { userCollection, familyCollection } = getAllCollections();

    // Create a family using Firestore API
    const familyRef = await addDoc(familyCollection.firestoreCollectionReference, {
      address: '123 Test Street',
      city: 'Test City'
    });

    // Create a user with reference to family using Firestore API
    const userRef = await addDoc(userCollection.firestoreCollectionReference, {
      username: 'testUser',
      family_id: familyRef.id
    });

    // Get user with family reference
    const retrievedUser = await userCollection.getById(userRef.id);
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.data.username).toBe('testUser');
    expect(retrievedUser.data.family_id).toBe(familyRef.id);

    // Get referenced family through user
    const referencedFamily = await retrievedUser.family.getEntity();
    expect(referencedFamily).toBeDefined();
    expect(referencedFamily.data.address).toBe('123 Test Street');
    expect(referencedFamily.data.city).toBe('Test City');
  });

  it('should update family reference and retrieve new family', async () => {
    const { userCollection, familyCollection } = getAllCollections();

    // Create first family using Firestore API
    const family1Ref = await addDoc(familyCollection.firestoreCollectionReference, {
      address: '123 Test Street',
      city: 'Test City'
    });

    // Create a user with reference to first family using Firestore API
    const userRef = await addDoc(userCollection.firestoreCollectionReference, {
      username: 'testUser',
      family_id: family1Ref.id
    });

    // Create second family using Firestore API
    const family2Ref = await addDoc(familyCollection.firestoreCollectionReference, {
      address: '456 New Street',
      city: 'New City'
    });

    // Verify user references first family
    const userBeforeUpdate = await userCollection.getById(userRef.id);
    expect(userBeforeUpdate.data.family_id).toBe(family1Ref.id);
    const firstFamily = await userBeforeUpdate.family.getEntity();
    expect(firstFamily.data.address).toBe('123 Test Street');
    expect(firstFamily.data.city).toBe('Test City');

    // Update user to reference second family
    await updateDoc(doc(userCollection.firestoreCollectionReference, userRef.id), {
      family_id: family2Ref.id
    });

    // Verify update directly with Firestore
    const userDocRef = doc(userCollection.firestoreCollectionReference, userRef.id);
    const updatedDoc = await getDoc(userDocRef);
    expect(updatedDoc.data()?.family_id).toBe(family2Ref.id);

    // Get user and verify it references the second family
    const retrievedUser = await userCollection.getById(userRef.id);
    expect(retrievedUser.data.family_id).toBe(family2Ref.id);

    // Get referenced family through user and verify it's the second family
    const referencedFamily = await retrievedUser.family.getEntity();
    expect(referencedFamily).toBeDefined();
    expect(referencedFamily.data.address).toBe('456 New Street');
    expect(referencedFamily.data.city).toBe('New City');
  });
});
