import { User, useRetrieveUserByIdMutation } from "@/redux/features/authApiSlice";
import { useState, useEffect } from "react";

const useUser = (id: number) => {
    const [retrieveUser, { isLoading, error }] = useRetrieveUserByIdMutation();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!id) return;  // Évite les appels avec un ID invalide

        retrieveUser(id)
            .unwrap()
            .then(setUser)
            .catch(console.error); // Pour éviter une erreur non gérée

    }, [id, retrieveUser]);  // Exécute la requête seulement quand `id` change

    return {
        user,
        isLoading,
        error
    };
};

export default useUser;
