import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  type Firestore,
  type DocumentData,
} from "firebase/firestore";
import type { UserRepository } from "../../domain/repositories/UserRepository";
import type { GroupRepository } from "../../domain/repositories/GroupRepository";
import type { User } from "../../domain/models/User";
import type { Group } from "../../domain/models/Group";

export class FirebaseUserRepository implements UserRepository {
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async getUsers(): Promise<User[]> {
    const snapshot = await getDocs(collection(this.db, "users"));
    return snapshot.docs.map((doc) => this.toUserModel(doc.id, doc.data()));
  }

  async getUserById(id: string): Promise<User | null> {
    const docRef = doc(this.db, "users", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return this.toUserModel(docSnap.id, docSnap.data());
  }

  async addUser(user: Omit<User, "id">): Promise<string> {
    const docRef = await addDoc(collection(this.db, "users"), user);
    return docRef.id;
  }

  async updateUser(id: string, user: Partial<User>): Promise<void> {
    await updateDoc(doc(this.db, "users", id), { ...user });
  }

  async deleteUser(id: string): Promise<void> {
    await deleteDoc(doc(this.db, "users", id));
  }

  private toUserModel(id: string, data: DocumentData): User {
    return {
      id,
      name: data.name,
      surname: data.surname,
      email: data.email,
      birthDate: data.birthDate.toDate(),
      groupIds: data.groupIds,
      showAge: data.showAge,
    };
  }
}

export class FirebaseGroupRepository implements GroupRepository {
  private readonly db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async getGroups(): Promise<Group[]> {
    const snapshot = await getDocs(collection(this.db, "groups"));
    return snapshot.docs.map((doc) => this.toGroupModel(doc.id, doc.data()));
  }

  async getGroupById(id: string): Promise<Group | null> {
    const docRef = doc(this.db, "groups", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return this.toGroupModel(docSnap.id, docSnap.data());
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const q = query(
      collection(this.db, "groups"),
      where("userIds", "array-contains", userId),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.toGroupModel(doc.id, doc.data()));
  }

  async addGroup(group: Omit<Group, "id">): Promise<string> {
    const docRef = await addDoc(collection(this.db, "groups"), group);
    return docRef.id;
  }

  async updateGroup(id: string, group: Partial<Group>): Promise<void> {
    await updateDoc(doc(this.db, "groups", id), { ...group });
  }

  async deleteGroup(id: string): Promise<void> {
    await deleteDoc(doc(this.db, "groups", id));
  }

  private toGroupModel(id: string, data: DocumentData): Group {
    return {
      id,
      name: data.name,
      userIds: data.userIds,
    };
  }
}
