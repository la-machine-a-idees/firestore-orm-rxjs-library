import { describe, it, expect, beforeEach } from 'vitest';
import { initTests, getAllCollections } from './initTests';

describe('ReferenceToOneFromForeignKey', () => {
  beforeEach(() => {
    initTests();
  });

  it('should create user, car with owner and retrieve car through reference', async () => {
    const { userCollection, carCollection } = getAllCollections();

    // Create a user
    const user = await userCollection.create({
      username: 'John Doe',
      group_ids: []
    });

    // Create a car
    const car = await carCollection.create({
      model: 'Tesla Model 3',
      user_owner_id: user.getId()
    });

    // Get the car through user's reference
    const userCar = await user.car.getEntity();

    // Verify the car is correctly retrieved
    expect(userCar).toBeDefined();
    expect(userCar.data.model).toBe('Tesla Model 3');
    expect(userCar.getId()).toBe(car.getId());
  });
});
