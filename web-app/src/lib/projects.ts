import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { DEFAULT_CANVAS_SIZE, type CanvasSize } from "./formats";

export type CanvasJson = Record<string, unknown>;

export interface ProjectRecord {
  id: string;
  title?: string;
  type?: string;
  ownerId?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  canvasJson?: CanvasJson | null;
}

export async function createProject(
  title: string,
  type: string,
  size: CanvasSize = DEFAULT_CANVAS_SIZE
) {
  try {
    const projectsRef = collection(db, "projects");

    const docRef = await addDoc(projectsRef, {
      title,
      type,
      ownerId: "Chief",
      canvasWidth: size.width,
      canvasHeight: size.height,
      canvasJson: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Erro crítico ao criar o projeto:", error);
    throw error;
  }
}

export async function getProject(id: string): Promise<ProjectRecord | null> {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ProjectRecord;
    }

    console.warn("Projeto não encontrado:", id);
    return null;
  } catch (error) {
    console.error("Erro ao buscar o projeto:", error);
    throw error;
  }
}

export async function updateProjectTitle(id: string, newTitle: string) {
  try {
    const docRef = doc(db, "projects", id);
    await updateDoc(docRef, {
      title: newTitle,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erro ao atualizar o título do projeto:", error);
    throw error;
  }
}

export async function updateProjectCanvas(
  id: string,
  canvasJson: CanvasJson,
  size: CanvasSize
) {
  try {
    const docRef = doc(db, "projects", id);
    await updateDoc(docRef, {
      canvasJson,
      canvasWidth: size.width,
      canvasHeight: size.height,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erro ao salvar o canvas do projeto:", error);
    throw error;
  }
}
