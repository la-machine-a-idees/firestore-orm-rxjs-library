import { describe, it, expect, beforeAll } from 'vitest';
import { FamilyEntity } from './FamilyEntity';
import { getAllCollections, initTests } from './initTests';
import { addDoc, orderBy, query, where } from 'firebase/firestore';

describe('Query operations', () => {

  beforeAll(() => {
    initTests();
  });

  it('should get a family created via Firestore API', async () => {
    const { familyCollection } = getAllCollections();
    
    // Create family directly via Firestore API
    const familyData = {
      address: '123 Main St',
      city: 'Paris'
    };
    
    const docRef = await addDoc(
      familyCollection.firestoreCollectionReference,
      familyData
    );

    // Get back via collection method
    const family = await familyCollection.getById(docRef.id);
    
    // Check data matches
    expect(family).toBeDefined();
    expect(family.data.address).toBe(familyData.address);
    expect(family.data.city).toBe(familyData.city);
  });
  
  it('should query families by city', async () => {
    const { familyCollection } = getAllCollections();
    
    // Generate unique city name
    const cityName = `Test City ${Date.now()}`;
    
    // Create multiple families via Firestore API
    const familiesData = [
      { address: '10 Oak St', city: cityName },
      { address: '20 Pine St', city: cityName },
      { address: '30 Maple St', city: cityName }
    ];
    
    // Add families to Firestore
    await Promise.all(familiesData.map(data => 
      addDoc(familyCollection.firestoreCollectionReference, data)
    ));

    // Query families by city using get
    const families = await familyCollection.get(ref => 
      query(ref, where('city', '==', cityName))
    )

    // Verify results
    expect(families).toBeDefined();
    expect(families?.length).toBe(3);
    families?.forEach(family => {
      expect(family.data.city).toBe(cityName);
    });
  }, 2000);

  
  it('should observe families being added to a city', async () => {
    const { familyCollection } = getAllCollections();
    
    // Generate unique city name
    const cityName = `Test City ${Date.now()}`;
    
    // Start observing families in this city
    const familiesReceived: FamilyEntity[][] = [];
    const subscription = familyCollection.observe$(ref =>
      query(ref, where('city', '==', cityName), orderBy('address'))
    ).subscribe(families => {
      console.log('families', families);
      familiesReceived.push(families);
    });

    // Wait a bit to ensure initial empty result is received
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create first family
    const family1Data = { 
      address: '10 Oak St',
      city: cityName 
    };
    await addDoc(familyCollection.firestoreCollectionReference, family1Data);

    // Wait for update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create second family
    const family2Data = {
      address: '20 Pine St', 
      city: cityName
    };
    await addDoc(familyCollection.firestoreCollectionReference, family2Data);

    // Wait for final update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Cleanup subscription
    subscription.unsubscribe();

    // Verify we received the correct sequence of updates
    expect(familiesReceived.length).toBe(3);
    expect(familiesReceived[0]).toHaveLength(0);
    expect(familiesReceived[1]).toHaveLength(1);
    expect(familiesReceived[2]).toHaveLength(2);
    
    expect(familiesReceived[1][0].data.address).toBe('10 Oak St');
    expect(familiesReceived[2][0].data.address).toBe('10 Oak St');
    expect(familiesReceived[2][1].data.address).toBe('20 Pine St');
  }, 4000);
  
  
  
});
