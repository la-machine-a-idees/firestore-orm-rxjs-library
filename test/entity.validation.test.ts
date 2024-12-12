import { describe, it, expect, beforeAll } from 'vitest'
import { z } from 'zod'
import { Entity } from '../src/entity'
import { initTests } from './initTests'

// Simple test entity with validation
const testSchema = z.object({
  name: z.string().min(3),
  age: z.number().min(0).max(150),
  email: z.string().email(),
  optional: z.string().optional(),
})

type TestData = z.infer<typeof testSchema>

class TestEntity extends Entity<TestData> {
  constructor() {
    super('test_entities', testSchema, {
      name: 'Test',
      age: 25,
      email: 'test@example.com',
    })
  }
}

describe('Entity Validation', () => {
  beforeAll(async () => {
    await initTests()
  })

  it('should create entity with valid data', () => {
    const validData: TestData = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
    }

    const entity = new TestEntity()
    expect(() => entity.setData(validData)).not.toThrow()
  })

  it('should throw on invalid name (too short)', () => {
    const invalidData: any = {
      name: 'Jo', // too short
      age: 30,
      email: 'john@example.com',
    }

    const entity = new TestEntity()
    expect(() => entity.setData(invalidData)).toThrow('Data validation failed')
  })

  it('should throw on invalid age (negative)', () => {
    const invalidData: any = {
      name: 'John',
      age: -1, // negative age
      email: 'john@example.com',
    }

    const entity = new TestEntity()
    expect(() => entity.setData(invalidData)).toThrow('Data validation failed')
  })

  it('should throw on invalid email format', () => {
    const invalidData: any = {
      name: 'John',
      age: 30,
      email: 'not-an-email', // invalid email
    }

    const entity = new TestEntity()
    expect(() => entity.setData(invalidData)).toThrow('Data validation failed')
  })

  it('should throw on missing required field', () => {
    const invalidData: any = {
      name: 'John',
      age: 30,
      // missing email
    }

    const entity = new TestEntity()
    expect(() => entity.setData(invalidData)).toThrow('Data validation failed')
  })

  it('should allow optional fields to be undefined', () => {
    const validData: TestData = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      optional: undefined,
    }

    const entity = new TestEntity()
    expect(() => entity.setData(validData)).not.toThrow()
  })

  it('should validate data on save', async () => {
    const entity = new TestEntity()

    // First set valid data
    entity.setData({
      name: 'John',
      age: 30,
      email: 'john@example.com',
    })

    // Then corrupt the data directly (simulating invalid state)
    ;(entity as any).data.age = -1

    // Attempt to save should fail validation
    await expect(entity.save()).rejects.toThrow('Data validation failed')
  })
})
