import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "./firebase";
import { Todo } from "../utilities/types";

const db = getFirestore(app);

// Add a new todo
export const addTodo = async (
  userId: string,
  todo: { id: string; text: string; completed: boolean }
) => {
  if (!userId) {
    throw new Error("userId must be defined");
  }

  const todoRef = doc(db, "todos", todo.id);
  const newTodo = {
    ...todo,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: Timestamp.fromDate(new Date()),
  };
  await setDoc(todoRef, newTodo);
};

export const updateTodo = async (
  id: string,
  updatedFields: Partial<{ text: string; completed: boolean }>
) => {
  const todoRef = doc(db, "todos", id);
  const updatedTodo = {
    ...updatedFields,
    updatedAt: serverTimestamp(),
  };
  await setDoc(todoRef, updatedTodo, { merge: true });
};

// Delete a todo
export const deleteTodo = async (id: string) => {
  const todoRef = doc(db, "todos", id);
  await deleteDoc(todoRef);
};

// Fetch todos
export const fetchTodos = async (userId: string): Promise<Todo[]> => {
  const todosCollection = collection(db, "todos");
  const q = query(todosCollection, orderBy("createdAt", "desc"));
  const todosSnapshot = await getDocs(q);

  return todosSnapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        completed: data.completed,
        userId: data.userId,
        createdAt: (data.createdAt as Timestamp)?.toDate(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate(),
        date: data.date,
      } as Todo;
    })
    .filter((todo) => todo.userId === userId);
};
