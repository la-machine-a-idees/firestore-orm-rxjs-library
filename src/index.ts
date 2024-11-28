import {  Firestore,   collection, getFirestore, } from 'firebase/firestore';
export { initializeApp } from 'firebase/app';
export { getFirestore } from 'firebase/firestore';

import { Collection } from './collection';
import { AnyEntity } from './entity';
import { FirebaseOptions } from 'firebase/app';
import { initializeApp } from 'firebase/app';
 
export { Collection } from './collection';
export { Entity, AnyEntity } from './entity';
export { ReferenceToOneFromKey } from './relations/ReferenceToOneFromKey';
export { oneReference, multipleReferences } from './schemaHelpers';



let db: Firestore;
const collections = new Map<string, Collection<AnyEntity>>();


export const initializeOrm = (firebaseConfig: FirebaseOptions) => {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
};


export const registerCollection = <ThisEntity extends AnyEntity>(
  collectionName: string,
  firestoreRootCollectionName: string,
  entityType: new () => ThisEntity,
  converter?: any // TODO
) => {
  if (collections.has(collectionName)) {
    throw new Error(`Collection '${collectionName}' already registered.`);
  } 
  
  const newCollection = new Collection<ThisEntity>(
    collection(
      db,
      firestoreRootCollectionName
    ),
    collectionName,
    entityType,
    converter
  );
  
  collections.set(collectionName, newCollection);
  return newCollection;
};


export const getCollection = <ThisEntity extends AnyEntity = AnyEntity>(collectionName: string) => {
  if (!collections.has(collectionName)) {
    throw new Error(`Collection '${collectionName}' was not registered.`);
  }
  
  return collections.get(collectionName) as Collection<ThisEntity>;
};


