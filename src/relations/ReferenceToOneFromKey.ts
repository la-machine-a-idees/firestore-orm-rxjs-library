import { getCollection } from '../index';
import { AnyEntity } from '../entity';

export class ReferenceToOneFromKey<
  ForeignEntity extends AnyEntity,
  ThisEntity extends AnyEntity
> {
  constructor(
    private thisEntity: ThisEntity,
    // TODO allow lambda to get value ?
    // TODO allow path to reduce to single value (if the value is inside an object)
    private key: keyof ThisEntity['data'],
    private foreignCollectionName: string
  ) { }

  async getEntity(): Promise<ForeignEntity | undefined> {
    const currentValue = this.thisEntity.data[this.key as string];
    if (!currentValue) {
      return undefined;
    }

    const collection = getCollection<ForeignEntity>(this.foreignCollectionName);
    return collection.getById(currentValue);
  }
}
