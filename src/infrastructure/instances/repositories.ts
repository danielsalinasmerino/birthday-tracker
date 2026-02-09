import { db } from "../firebase/config";
import {
  FirebaseUserRepository,
  FirebaseGroupRepository,
} from "../adapters/FirebaseRepository";

// Create repository instances
export const userRepository = new FirebaseUserRepository(db);
export const groupRepository = new FirebaseGroupRepository(db);
