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

  constructor(
    public readonly firestoreCollectionReference: CollectionReference,
    private entityType: new () => ThisEntity,
  ) { }


  async create(data: ThisEntity['data']): Promise<ThisEntity> {
    const entity = new this.entityType();
    entity.setData(data);
    await entity.save();
    return entity;
  }

  async getById(id: string): Promise<ThisEntity> {


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

          const entity = this._createEntity(doc);

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
    return entity;
  }

  get(
    queryFn?: (collectionRef: CollectionReference) => Query
  ): Promise<ThisEntity[]> {
    return firstValueFrom(this.observe$(queryFn));
  }

}
