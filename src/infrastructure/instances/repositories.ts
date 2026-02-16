import { db } from "../firebase/config";
import { FirebaseUserRepository } from "../adapters/firebase/FirebaseUserRepository";
import { FirebaseGroupRepository } from "../adapters/firebase/FirebaseGroupRepository";

// Create repository instances
export const userRepository = new FirebaseUserRepository(db);
export const groupRepository = new FirebaseGroupRepository(db);
