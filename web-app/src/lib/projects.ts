import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Função para criar um novo projeto no Firestore
export async function createProject(title: string, type: string) {
    try {
        // Aponta para a coleção 'projects' (o Firebase cria automaticamente se não existir)
        const projectsRef = collection(db, 'projects');

        // Adiciona o documento
        const docRef = await addDoc(projectsRef, {
            title: title,
            type: type,
            ownerId: 'Chief', // Sessão mockada que definimos anteriormente
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        // Retorna o ID único gerado pelo Firebase para usarmos no redirecionamento
        return docRef.id;
    } catch (error) {
        console.error("Erro crítico ao criar o projeto:", error);
        throw error;
    }
}

// Função para buscar um único projeto
export async function getProject(id: string) {
    try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.warn("Projeto não encontrado:", id);
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar o projeto:", error);
        throw error;
    }
}

// Função para atualizar o título do projeto
export async function updateProjectTitle(id: string, newTitle: string) {
    try {
        const docRef = doc(db, 'projects', id);
        await updateDoc(docRef, {
            title: newTitle,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Erro ao atualizar o título do projeto:", error);
        throw error;
    }
}