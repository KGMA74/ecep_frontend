'use client';
import { useRouter } from "next/navigation";
import type { conversationtype } from "@/utils/type";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";

interface props {
    conversation: conversationtype;
}

const  Conversation: React.FC<props> = ({
    conversation
}) => {
    const { data: me } = useRetrieveUserQuery();
    const router = useRouter();
    const otherUser = conversation.users.find((user) => user.id !== me?.id);
    
    return (
        <div onClick={() => router.push(`/inbox/${conversation.id}`)} className=" cursor-pointer border border-gray-300 rounded-xl">
            <p className="m-6 text-xl">{otherUser?.nickname}</p>  
        </div>
    );
}

export default Conversation;
