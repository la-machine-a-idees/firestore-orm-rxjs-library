import { getCollection, initializeOrm, registerCollection } from "../src/index";
import { UserEntity } from "./UserEntity";
import { FamilyEntity } from "./FamilyEntity";

let initialized = false;

export function initTests() {
  if (initialized) {
    return;
  }
  initialized = true;
  
  const firebaseConfig = {
    apiKey: 'AIzaSyDn8MsKvdearie6PBSDOpYLINPmNyxqO4k',
    authDomain: 'test-orm-package.firebaseapp.com',
    projectId: 'test-orm-package',
    storageBucket: 'test-orm-package.appspot.com',
    messagingSenderId: '547261186342',
    appId: '1:547261186342:web:350fb5012468c0ab6041e7',
  };
 
  initializeOrm(firebaseConfig);
  
  registerCollection('users', 'users', UserEntity);
  registerCollection('families', 'families', FamilyEntity);
}

export function getAllCollections() {
  return {
    userCollection: getCollection<UserEntity>('users'),
    familyCollection: getCollection<FamilyEntity>('families'),
  }
}