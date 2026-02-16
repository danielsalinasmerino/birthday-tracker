import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  type Firestore,
  type DocumentData,
} from "firebase/firestore";
import type { UserRepository } from "../../../domain/repositories/UserRepository";
import type { User } from "../../../domain/models/User";

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
