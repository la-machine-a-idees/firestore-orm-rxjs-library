import { describe, it, expect, beforeEach } from 'vitest'
import { initTests, getAllCollections } from './initTests'
import { a } from 'vitest/dist/chunks/suite.B2jumIFP.js'

describe('ReferenceToMultipleFromForeignArrayKey', () => {
  beforeEach(() => {
    initTests()
  })

  it('should create group, multiple users and retrieve users through group reference', async () => {
    const { userCollection, groupCollection } = getAllCollections()

    // Create a group
    const group = await groupCollection.create({
      name: 'Developers',
    })

    // Create multiple users with the group
    const user1 = await userCollection.create({
      username: 'John Doe',
      group_ids: [group.getId()!],
    })

    const user2 = await userCollection.create({
      username: 'Jane Smith',
      group_ids: [group.getId()!],
    })

    // Get the users through group's reference
    const groupUsers = await group.users.getEntities()

    // Verify the users are correctly retrieved
    expect(groupUsers).toBeDefined()
    expect(groupUsers.length).toBe(2)
    expect(groupUsers.map((u) => u.data.username).sort()).toEqual(['John Doe', 'Jane Smith'].sort())
    expect(groupUsers.map((u) => u.getId()!).sort()).toEqual([user1.getId()!, user2.getId()!].sort())
  })

  it('should update group users when user is added to group', async () => {
    const { userCollection, groupCollection } = getAllCollections()

    // Create a group
    const group = await groupCollection.create({
      name: 'Developers',
    })

    // Create a user without any group
    const user = await userCollection.create({
      username: 'John Doe',
      group_ids: [],
    })

    // Verify group has no users
    const emptyGroupUsers = await group.users.getEntities()
    expect(emptyGroupUsers).toBeDefined()
    expect(emptyGroupUsers.length).toBe(0)

    // Add user to group
    user.data.group_ids?.push(group.getId())
    await user.save()

    // Verify group now has one user
    const groupUsers = await group.users.getEntities()
    expect(groupUsers).toBeDefined()
    expect(groupUsers.length).toBe(1)
    expect(groupUsers[0].getId()).toBe(user.getId())
    expect(groupUsers[0].data.username).toBe('John Doe')
  })
})
