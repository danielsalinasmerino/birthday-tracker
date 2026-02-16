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
import type { GroupRepository } from "../../../domain/repositories/GroupRepository";
import type { Group } from "../../../domain/models/Group";

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
