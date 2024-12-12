import { getCollection } from '../index'
import { AnyEntity } from '../entity'
import { query, where } from 'firebase/firestore'

export class ReferenceToMultipleFromForeignArrayKey<ForeignEntity extends AnyEntity, ThisEntity extends AnyEntity> {
  constructor(
    private thisEntity: ThisEntity,
    private foreignArrayKey: keyof ForeignEntity['data'],
    private foreignCollectionName: string
  ) {}

  async getEntities(): Promise<ForeignEntity[]> {
    if (!this.thisEntity.getId()) {
      throw new Error('Source entity has no ID')
    }

    const collection = getCollection<ForeignEntity>(this.foreignCollectionName)
    return collection.get((ref) =>
      query(ref, where(this.foreignArrayKey as string, 'array-contains', this.thisEntity.getId()))
    )
  }
}
