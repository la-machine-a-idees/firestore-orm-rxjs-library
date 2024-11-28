import {
  firstValueFrom,
  map,
  Observable,
  shareReplay,
  Subject,
  finalize,
} from 'rxjs';
import { AnyEntity } from './entity';
import {
  CollectionReference,
  doc,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  query,
  Query,
  QuerySnapshot,
} from 'firebase/firestore';

export class Collection<ThisEntity extends AnyEntity> {
  
  private entitiesCache = new Map<string, ThisEntity>();

  constructor(
    public readonly firestoreCollectionReference: CollectionReference,
    private collectionName: string,
    private entityType: new () => ThisEntity,
    private converter?: any // TODO
  ) { }
  
  
  async create(data: ThisEntity['data']): Promise<ThisEntity> { 
    const entity = new this.entityType();
    entity.setData(data);
    await entity.save();
    return entity;    
  }

  async getById(id: string): Promise<ThisEntity> {
    if (this.entitiesCache.has(id)) {
      return this.entitiesCache.get(id)!;
    }

    // TODO return quickly a promise and cache promises with a pool which auto remove ?

    const docRef = doc(this.firestoreCollectionReference, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Entity with id ${id} not found`);
    }

    const newEntity = this._createEntity(docSnap);

    return newEntity;
  }

  observe$(
    queryFn?: (collectionRef: CollectionReference) => Query
  ): Observable<ThisEntity[]> {
    // Get custom query or, by default, create a query to get all documents.
    const aQuery = queryFn
      ? queryFn(this.firestoreCollectionReference)
      : query(this.firestoreCollectionReference);

    //const results = getDocs(aQuery).then(r => r.docChanges());

    const sub = new Subject<QuerySnapshot>();

    const unsubscribe = onSnapshot(aQuery, sub);

    return sub.pipe(
      map((querySnapshot) => {
        const res = querySnapshot.docs.map((doc) => {
          // TODO idea: add change type for animation
          const id = doc.id; 

          let entity: ThisEntity;
          if (this.entitiesCache.has(id)) {
            entity = this.entitiesCache.get(id)!;
          } else {
            entity = this._createEntity(doc);
          } 

          return entity;
        });
 
        return res;
      }),

      shareReplay(1),
      finalize(() => {
        // Cette fonction sera appelée quand il n'y aura plus d'abonnés
        unsubscribe();
        sub.complete();
      })
    );
  }

  private _createEntity(doc: DocumentSnapshot) {
    const entity = new this.entityType();    
    entity._setDocRef(doc.ref);
    entity.data = doc.data()!;
    this.entitiesCache.set(doc.ref.id, entity);
    return entity;
  }

  get(
    queryFn?: (collectionRef: CollectionReference) => Query
  ): Promise<ThisEntity[]> {
    return firstValueFrom(this.observe$(queryFn));
  }

  _addEntity(entity: ThisEntity) {
    if (!entity.getId()) {
      throw new Error('Entity has no id. Save it first.');
    }

    const entityId = entity.getId()!;
    if (!this.entitiesCache.has(entityId)) {
      this.entitiesCache.set(entityId, entity);
    }
  }

  _removeEntity(entity: ThisEntity) {
    this.entitiesCache.delete(entity.getId()!);
  }
}
