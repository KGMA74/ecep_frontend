'use client';

import React, { useState, useEffect } from 'react';
import { api } from "@/utils/api";
import type { userType, ProfileType, conversationtype } from "@/utils/type";
import UserChat from "./UserChat";
import { AiOutlineSearch } from 'react-icons/ai';

interface AddConversationProps {
    onCreateConversation: (conversationId: string) => void;
    currentUser: userType;  // Utilisateur connecté
}

interface SearchResponse {
    profiles: ProfileType[];
    tags: any[];
    posts: any[];
}

const AddConversation: React.FC<AddConversationProps> = ({ onCreateConversation, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchUsers, setSearchUsers] = useState<ProfileType[]>([]);

    const getProfiles = async () => {
        try {
            const response = await api.get("profiles/");
            const data: ProfileType[] = await response.json();
            setSearchUsers(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des profils :", error);
        }
    };

    const handleSearch = async (query: string) => {
        if (query.trim() === '') {
            setSearchUsers([]); // Réinitialise la liste si la recherche est vide
            return;
        }
        try {
            const response = await api.get(`search/?q=${query}`);
            const data: SearchResponse = await response.json();
            if (data.profiles) {
                setSearchUsers(data.profiles);
            } else {
                console.error("Aucun profil trouvé dans la réponse");
                setSearchUsers([]); // Réinitialise la liste si aucun profil trouvé
            }
        } catch (error) {
            console.error("Erreur lors de la recherche :", error);
        }
    };

    const handleSelectUser = async (user: userType) => {
        const conversationExists = await checkConversationExists(currentUser.id, user.id);
        if (conversationExists) {
            // Si une conversation existe, l'ouvrir
            onCreateConversation(conversationExists.id);
        } else {
            // Créer une nouvelle conversation avec les deux utilisateurs
            //console.log([currentUser, user]);
            await createConversation([currentUser, user]);
            
        }
    };

    const checkConversationExists = async (currentUserId: number, selectedUserId: number): Promise<conversationtype | undefined> => {
        try {
            const response = await api.get(`chat/`);
            const conversations: conversationtype[] = await response.json();
            //console.log(currentUserId,selectedUserId)
            //console.log(conversations);
            // Vérifier s'il existe une conversation contenant exactement les deux utilisateurs
            return conversations.find((conv) => {
                const userIds = conv.users.map(user => user.id);
                return userIds.includes(currentUserId) && userIds.includes(selectedUserId);
            });
        } catch (error) {
            console.error("Erreur lors de la vérification de la conversation :", error);
            return undefined;
        }
    };

    const createConversation = async (users: userType[]) => {
        const conversationData = {
            users: users.map(user => user.id),
        };

        try {
            console.log(conversationData)
            const response = await api.post("chat/create/", { json: conversationData });
            if (!response.ok) {
                const errorDetails: any = await response.json(); // Type 'any' pour la réponse d'erreur
                throw new Error(`Erreur lors de la création de la conversation : ${errorDetails.message || response.statusText}`);
            }
            const createdConversation: conversationtype = await response.json();
            onCreateConversation(createdConversation.id); // Ouvrir la nouvelle conversation
        } catch (error) {
            console.error("Erreur lors de la création de la conversation :", error);
        }
    };

    useEffect(() => {
        
        getProfiles();
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleSearch(searchTerm);
    };

    return (
        <div className="bg-white rounded-lg p-6 max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="relative mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher des utilisateurs..."
                    className="bg-gray-100 text-black py-2 px-4 rounded-full w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition duration-200"
                >
                    <AiOutlineSearch size={24} />
                </button>
            </form>
            <div className="max-h-60 overflow-y-auto">
                {searchTerm.trim() === '' ? (
                    <p className="text-gray-500">Entrez un nom ou un email pour rechercher des utilisateurs.</p>
                ) : searchUsers.length > 0 ? (
                    searchUsers.map((profile) => (
                        <div 
                            key={profile.user.id} 
                            className="flex items-center p-2 hover:bg-gray-200 cursor-pointer rounded-md transition duration-150"
                        >
                            <UserChat 
                                profile={profile} 
                                onClick={() => handleSelectUser(profile.user as userType)} 
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Aucun utilisateur trouvé</p>
                )}
            </div>
        </div>
    );
};

export default AddConversation;
