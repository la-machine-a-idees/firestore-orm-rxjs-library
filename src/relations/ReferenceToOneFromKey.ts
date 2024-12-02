import { getCollection } from '../index';
import { AnyEntity } from '../entity';

export class ReferenceToOneFromKey<
  ForeignEntity extends AnyEntity,
  ThisEntity extends AnyEntity
> {

  private previousValue?: string;

  private foreignEntity?: ForeignEntity

  constructor(
    private thisEntity: ThisEntity,
    // TODO allow lambda to get value ?
    // TODO allow path to reduce to single value (if the value is inside an object)
    private key: keyof ThisEntity['data'],
    private foreignCollectionName: string
  ) {
  }


  async getEntity(): Promise<ForeignEntity> {
    const currentValue = this.thisEntity.data[this.key as string];
    if (currentValue !== this.previousValue) {
      const collection = getCollection<ForeignEntity>(this.foreignCollectionName);
      this.foreignEntity = await collection.getById(currentValue);
      this.previousValue = currentValue;
    }
    return this.foreignEntity!;
  }
}


