import { getCollection } from '../index';
import { AnyEntity } from '../entity';
import { query, where, limit } from 'firebase/firestore';

export class ReferenceToOneFromForeignKey<
  ForeignEntity extends AnyEntity,
  ThisEntity extends AnyEntity
> {
  constructor(
    private thisEntity: ThisEntity,
    private foreignKey: keyof ForeignEntity['data'],
    private foreignCollectionName: string
  ) { }

  async getEntity(): Promise<ForeignEntity | undefined> {
    if (!this.thisEntity.getId()) {
      throw new Error('Source entity has no ID');
    }

    const collection = getCollection<ForeignEntity>(this.foreignCollectionName)
    const results = await collection.get(ref => query(
      ref,
      where(this.foreignKey as string, '==', this.thisEntity.getId()),
      limit(1)
    ));
    return results[0];
  }
}
