import React from 'react';
import type { ProfileType } from "@/utils/type";
import Image from 'next/image';

interface UserChatProps {
    profile: ProfileType;
    onClick: () => void; // Ajout de la prop onClick
}

const UserChat: React.FC<UserChatProps> = ({ profile, onClick }) => {
    return (
        <div onClick={onClick} className="cursor-pointer p-2 hover:bg-gray-200">
            <Image
                src={profile.photo || '/moi.png'}
                alt='photo'
                width={50}
                height={50}
                className="w-8 h-8 rounded-full" 
            />
            <span>{profile.user.nickname}</span>
        </div>
    );
};

export default UserChat;
