import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { User, Group } from "../types";

// Users
export const getUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        birthDate: doc.data().birthDate.toDate(),
      }) as User,
  );
};

export const addUser = async (user: Omit<User, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "users"), user);
  return docRef.id;
};

export const updateUser = async (
  id: string,
  user: Partial<User>,
): Promise<void> => {
  await updateDoc(doc(db, "users", id), user);
};

export const deleteUser = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "users", id));
};

// Groups
export const getGroups = async (): Promise<Group[]> => {
  const snapshot = await getDocs(collection(db, "groups"));
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Group,
  );
};

export const getUserGroups = async (userId: string): Promise<Group[]> => {
  const q = query(
    collection(db, "groups"),
    where("members", "array-contains", userId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Group,
  );
};

export const addGroup = async (group: Omit<Group, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "groups"), group);
  return docRef.id;
};

export const updateGroup = async (
  id: string,
  group: Partial<Group>,
): Promise<void> => {
  await updateDoc(doc(db, "groups", id), group);
};

export const deleteGroup = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "groups", id));
};
