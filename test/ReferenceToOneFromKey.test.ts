import { describe, it, expect, beforeEach } from 'vitest';
import { initTests, getAllCollections } from './initTests';
import { UserEntity } from './UserEntity';
import { HouseEntity } from './HouseEntity';
import { addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';

describe('ReferenceToOneFromKey', () => {
  beforeEach(() => {
    initTests();
  });

  it('should create house, user with house_id and retrieve house through reference', async () => {
    const { userCollection, houseCollection } = getAllCollections();

    // Create a house using Firestore API
    const houseRef = await addDoc(houseCollection.firestoreCollectionReference, {
      address: '123 Test Street',
      city: 'Test City'
    });

    // Create a user with reference to house using Firestore API
    const userRef = await addDoc(userCollection.firestoreCollectionReference, {
      username: 'testUser',
      house_id: houseRef.id
    });

    // Get user with house reference
    const retrievedUser = await userCollection.getById(userRef.id);
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.data.username).toBe('testUser');
    expect(retrievedUser.data.house_id).toBe(houseRef.id);

    // Get referenced house through user
    const referencedHouse = await retrievedUser.house.getEntity();
    expect(referencedHouse).toBeDefined();
    expect(referencedHouse.data.address).toBe('123 Test Street');
    expect(referencedHouse.data.city).toBe('Test City');
  });

  it('should update house reference and retrieve new house', async () => {
    const { userCollection, houseCollection } = getAllCollections();

    // Create first house using Firestore API
    const house1Ref = await addDoc(houseCollection.firestoreCollectionReference, {
      address: '123 Test Street',
      city: 'Test City'
    });

    // Create a user with reference to first house using Firestore API
    const userRef = await addDoc(userCollection.firestoreCollectionReference, {
      username: 'testUser',
      house_id: house1Ref.id
    });

    // Create second house using Firestore API
    const house2Ref = await addDoc(houseCollection.firestoreCollectionReference, {
      address: '456 New Street',
      city: 'New City'
    });

    // Verify user references first house
    const userBeforeUpdate = await userCollection.getById(userRef.id);
    expect(userBeforeUpdate.data.house_id).toBe(house1Ref.id);
    const firstHouse = await userBeforeUpdate.house.getEntity();
    expect(firstHouse.data.address).toBe('123 Test Street');
    expect(firstHouse.data.city).toBe('Test City');

    // Update user to reference second house
    userBeforeUpdate.data.house_id = house2Ref.id;
    await userBeforeUpdate.save();

    // Verify update directly with Firestore
    const userDocRef = doc(userCollection.firestoreCollectionReference, userRef.id);
    const updatedDoc = await getDoc(userDocRef);
    expect(updatedDoc.data()?.house_id).toBe(house2Ref.id);

    // Get user and verify it references the second house
    const retrievedUser = await userCollection.getById(userRef.id);
    expect(retrievedUser.data.house_id).toBe(house2Ref.id);

    // Get referenced house through user and verify it's the second house
    const referencedHouse = await retrievedUser.house.getEntity();
    expect(referencedHouse).toBeDefined();
    expect(referencedHouse.data.address).toBe('456 New Street');
    expect(referencedHouse.data.city).toBe('New City');
  });
});
