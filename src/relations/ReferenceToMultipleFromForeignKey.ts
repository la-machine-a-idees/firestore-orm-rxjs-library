import { getCollection } from '../index';
import { AnyEntity } from '../entity';
import { query, where } from 'firebase/firestore';

export class ReferenceToMultipleFromForeignKey<
  ForeignEntity extends AnyEntity,
  ThisEntity extends AnyEntity
> {
  private foreignEntities?: ForeignEntity[]

  constructor(
    private thisEntity: ThisEntity,
    private foreignKey: keyof ForeignEntity['data'],
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
        where(this.foreignKey as string, '==', this.thisEntity.getId())
      ));
    }

    return this.foreignEntities;
  }
}
