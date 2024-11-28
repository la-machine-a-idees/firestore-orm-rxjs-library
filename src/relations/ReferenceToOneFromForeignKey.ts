import { Collection } from '../collection';
import { getCollection } from '../index';
import { AnyEntity } from '../entity';
import { filter, map, Observable, of, ReplaySubject } from 'rxjs';
import { limit, query, where } from 'firebase/firestore';


export class ReferenceToOneFromForeignKey<
  ForeignEntity extends AnyEntity,
  ThisEntity extends AnyEntity
> {
  private foreignEntity?: ForeignEntity

  constructor(
    private thisEntity: ThisEntity,
    private foreignKey: string,
    private foreignCollectionName: string
  ) { }

  async getEntity(): Promise<ForeignEntity> {
    if (!this.thisEntity.getId()) {
      throw new Error('Source entity has not ID');
    }

    // Lazy loading
    if (!this.foreignEntity) {
      const collection = getCollection<ForeignEntity>(this.foreignCollectionName)
      const results = await collection.get(ref => query(
        ref,
        where(this.foreignKey, '==', this.thisEntity.getId()),
        limit(1)
      ));
      this.foreignEntity = results[0];
    }

    return this.foreignEntity;
  }
}
