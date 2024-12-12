import { deleteDoc, onSnapshot, setDoc } from "firebase/firestore";
import { DocumentReference } from "firebase/firestore";
import { addDoc, DocumentData } from "firebase/firestore";
import { ReferenceToOneFromKey } from "./relations/ReferenceToOneFromKey";
import { getCollection } from './index';
import { SomeZodObject } from "zod";
import { ReferenceToOneFromForeignKey } from "./relations/ReferenceToOneFromForeignKey";
import { ReferenceToMultipleFromForeignKey } from "./relations/ReferenceToMultipleFromForeignKey";
import { ReferenceToMultipleFromForeignArrayKey } from "./relations/ReferenceToMultipleFromForeignArrayKey";

export class Entity<
  // DocumentSchemaType must be Firestore's DocumentData
  DocumentSchemaType extends DocumentData
// and cannot be a Zod. It prevents to forget "z.infer"
//& DocumentSchemaType extends ZodType ? never : unknown
> {
  data!: DocumentSchemaType;

  private docRef?: DocumentReference;

  private deleted = false;

  constructor(
    public collectionName: string,
    private documentZodSchema: SomeZodObject,
    initialData: DocumentSchemaType
  ) {
    this.setData(initialData);
  }

  _setDocRef(docRef: DocumentReference) {
    this.docRef = docRef;
  }

  setData(newData: DocumentSchemaType) {
    const validationResult = this.documentZodSchema.safeParse(newData);
    if (!validationResult.success) {
      throw new Error(`Data validation failed: ${validationResult.error.message}`);
    }
    this.data = newData;
  }


  protected referencesToOne<
    ForeignEntity extends AnyEntity,
    ThisEntity extends AnyEntity = this
  >(foreignCollectionName: string)
    : {
      fromKey: (
        key: keyof ThisEntity['data']
      ) => ReferenceToOneFromKey<ForeignEntity, ThisEntity>;
      fromForeignKey: (
        key: keyof ForeignEntity['data']
      ) => ReferenceToOneFromForeignKey<ForeignEntity, ThisEntity>;
    } {
    return {
      fromKey: (key: keyof ThisEntity['data']) =>
        new ReferenceToOneFromKey<ForeignEntity, ThisEntity>(
          this as unknown as ThisEntity,
          key as string,
          foreignCollectionName
        ),

      fromForeignKey: (foreignKey: keyof ForeignEntity['data']) => {
        return new ReferenceToOneFromForeignKey<ForeignEntity, ThisEntity>(
          this as unknown as ThisEntity,
          foreignKey as string,
          foreignCollectionName
        )
      }
    }
  }

  protected referencesToMultiple<
    ForeignEntity extends AnyEntity,
    ThisEntity extends AnyEntity = this
  >(foreignCollectionName: string)
  {
    return {
      fromForeignKey: (foreignKey: keyof ForeignEntity['data']) => {
        return new ReferenceToMultipleFromForeignKey<ForeignEntity, ThisEntity>(
          this as unknown as ThisEntity,
          foreignKey,
          foreignCollectionName
        )
      },
      fromForeignArrayKey: (foreignKey: keyof ForeignEntity['data']) => {
        return new ReferenceToMultipleFromForeignArrayKey<ForeignEntity, ThisEntity>(
          this as unknown as ThisEntity,
          foreignKey,
          foreignCollectionName
        )
      }
    }
  }
  
  hasId() {
    return !!this.docRef;
  }

  getId() {
    if (!this.docRef) throw new Error('Entity not saved');
    return this.docRef.id;
  }

  async save() {
    if (this.deleted) {
      throw new Error('Entity deleted');
    }
    
    const validationResult = this.documentZodSchema.safeParse(this.data);
    if (!validationResult.success) {
      throw new Error(`Data validation failed: ${validationResult.error.message}`);
    }

    if (!this.docRef) {
      const collection = getCollection(this.collectionName);

      // This is an unstored entity, we need to add firestore document
      this.docRef = await addDoc(
        collection.firestoreCollectionReference,
        this.data
      )
    } else {
      await setDoc(this.docRef, this.data);
    }
  }

  async delete() {
    // TODO Info it does not remove subcollections. Create another method for that.

    if (this.deleted) {
      throw new Error('Entity deleted');
    }
    
    this.setRealtimeUpdates(false)

    if (this.docRef) {
      await deleteDoc(this.docRef);
      this.docRef = undefined;
    }

    // Object.keys(this.relations).forEach(key => { this.relations[key].entityWasDeleted(); });
    this.data = undefined as any;
    this.deleted = true;

  }


  private unsubscribeSnapshot?: () => void;

  setRealtimeUpdates(enabled: boolean) {
    if (enabled) {
      if (!this.docRef) {
        console.warn('Cannot enable realtime updates on unsaved entity');
        return;
      }

      if (this.unsubscribeSnapshot) {
        // Already subscribed
        return;
      }

      this.unsubscribeSnapshot = onSnapshot(this.docRef, (doc) => {
        if (doc.exists()) {
          this.data = doc.data() as DocumentSchemaType
        }
      });

    } else {
      if (this.unsubscribeSnapshot) {
        this.unsubscribeSnapshot();
        this.unsubscribeSnapshot = undefined;
      }
    }
  }
  
  /*
  createClone<EntityType extends OrmEntity<DataType>>(): EntityType {
    console.assert(this.__docRef && !this.isDeleted);
    const clone = new this.__collectionConfig.entityType();
    clone.__setAll(
      this.__id,
      this.__manager,
      this.__docRef,
      cloneDeep(this.data),
      this.__collectionConfig
    );
    return clone as EntityType;
  }
  */

}

export type AnyEntity = Entity<DocumentData>;
