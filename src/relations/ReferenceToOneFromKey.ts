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
    private key: string, // TODO allow lambda to get value
    private foreignCollectionName: string
  ) {
  }
  

  async getEntity(): Promise<ForeignEntity> {
    
    if (this.foreignEntity === undefined) {
      const currentValue = this.thisEntity.data[this.key]
      if (currentValue !== this.previousValue) {
        const collection = getCollection<ForeignEntity>(this.foreignCollectionName);
        this.foreignEntity = await collection.getById(currentValue);
        this.previousValue = currentValue;
      }
    }
    
    return this.foreignEntity!;
  }
}


