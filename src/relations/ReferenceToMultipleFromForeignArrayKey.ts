import { getCollection } from '../index';
import { AnyEntity } from '../entity';
import { query, where, FieldPath } from 'firebase/firestore';

export class ReferenceToMultipleFromForeignArrayKey<
  ForeignEntity extends AnyEntity,
  ThisEntity extends AnyEntity
> {
  private foreignEntities?: ForeignEntity[]

  constructor(
    private thisEntity: ThisEntity,
    private foreignArrayKey: keyof ForeignEntity['data'],
    private foreignCollectionName: string
  ) { }

  async getEntities(): Promise<ForeignEntity[]> {
    if (!this.thisEntity.getId()) {
      throw new Error('Source entity has no ID');
    }

    // Lazy loading
    if (!this.foreignEntities) {
      const collection = getCollection<ForeignEntity>(this.foreignCollectionName)
      this.foreignEntities = await collection.get(ref => query(
        ref,
        where(this.foreignArrayKey as string, 'array-contains', this.thisEntity.getId())
      ));
    }

    return this.foreignEntities;
  }
}
