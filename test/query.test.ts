import { describe, it, expect, beforeAll } from 'vitest';
import { HouseEntity } from './HouseEntity';
import { getAllCollections, initTests } from './initTests';
import { addDoc, orderBy, query, where } from 'firebase/firestore';

describe('Query operations', () => {

  beforeAll(() => {
    initTests();
  });

  it('should get a house created via Firestore API', async () => {
    const { houseCollection } = getAllCollections();
    
    // Create house directly via Firestore API
    const houseData = {
      address: '123 Main St',
      city: 'Paris'
    };
    
    const docRef = await addDoc(
      houseCollection.firestoreCollectionReference,
      houseData
    );

    // Get back via collection method
    const house = await houseCollection.getById(docRef.id);
    
    // Check data matches
    expect(house).toBeDefined();
    expect(house.data.address).toBe(houseData.address);
    expect(house.data.city).toBe(houseData.city);
  });
  
  it('should query houses by city', async () => {
    const { houseCollection } = getAllCollections();
    
    // Generate unique city name
    const cityName = `Test City ${Date.now()}`;
    
    // Create multiple houses via Firestore API
    const housesData = [
      { address: '10 Oak St', city: cityName },
      { address: '20 Pine St', city: cityName },
      { address: '30 Maple St', city: cityName }
    ];
    
    // Add houses to Firestore
    await Promise.all(housesData.map(data => 
      addDoc(houseCollection.firestoreCollectionReference, data)
    ));

    // Query houses by city using get
    const houses = await houseCollection.get(ref => 
      query(ref, where('city', '==', cityName))
    )

    // Verify results
    expect(houses).toBeDefined();
    expect(houses?.length).toBe(3);
    houses?.forEach(house => {
      expect(house.data.city).toBe(cityName);
    });
  }, 2000);

  
  it('should observe houses being added to a city', async () => {
    const { houseCollection } = getAllCollections();
    
    // Generate unique city name
    const cityName = `Test City ${Date.now()}`;
    
    // Start observing houses in this city
    const housesReceived: HouseEntity[][] = [];
    const subscription = houseCollection.observe$(ref =>
      query(ref, where('city', '==', cityName), orderBy('address'))
    ).subscribe(houses => {
      console.log('houses', houses);
      housesReceived.push(houses);
    });

    // Wait a bit to ensure initial empty result is received
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create first house
    const house1Data = { 
      address: '10 Oak St',
      city: cityName 
    };
    await addDoc(houseCollection.firestoreCollectionReference, house1Data);

    // Wait for update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create second house
    const house2Data = {
      address: '20 Pine St', 
      city: cityName
    };
    await addDoc(houseCollection.firestoreCollectionReference, house2Data);

    // Wait for final update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Cleanup subscription
    subscription.unsubscribe();

    // Verify we received the correct sequence of updates
    expect(housesReceived.length).toBe(3);
    expect(housesReceived[0]).toHaveLength(0);
    expect(housesReceived[1]).toHaveLength(1);
    expect(housesReceived[2]).toHaveLength(2);
    
    expect(housesReceived[1][0].data.address).toBe('10 Oak St');
    expect(housesReceived[2][0].data.address).toBe('10 Oak St');
    expect(housesReceived[2][1].data.address).toBe('20 Pine St');
  }, 4000);
  
  
  
});
