import { User, useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { conversationtype } from "@/utils/type";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import useWebSockt, { ReadyState } from "react-use-websocket";
import type { instantMessageType, messageType } from "@/utils/type";

interface props {
    conversation: conversationtype;
    oldMessages: messageType[];
}

const ConversationDetail: React.FC<props> = ({ conversation, oldMessages }) => {
    const { data: me } = useRetrieveUserQuery();
    const otherUser = conversation.users?.find((user) => user.id !== me?.id);
    const [newMessage, setnewMessage] = useState("");
    const messageDiv = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<instantMessageType[]>([]);
    const router = useRouter();

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSockt(
        `${process.env.NEXT_PUBLIC_WS_URL}/ws/${conversation.id}/`,
        {
            share: false,
            shouldReconnect: () => true,
        }
    );

    useEffect(() => {
        console.log("connection state changed", readyState);
    }, [readyState]);

    useEffect(() => {
        if (
            lastJsonMessage &&
            typeof lastJsonMessage === "object" &&
            "name" in lastJsonMessage &&
            "body" in lastJsonMessage
        ) {
            const message: instantMessageType = {
                id: "",
                name: lastJsonMessage.name as string,
                body: lastJsonMessage.body as string,
                sent_to: otherUser as User,
                author: me as User,
                conversationId: conversation.id,
            };

            setMessages((messages) => [...messages, message]);
        }
        scrollToBottom();
    }, [lastJsonMessage, conversation, me, otherUser]);

    const sendMessage = async () => {
        console.log("Sending message");
        sendJsonMessage({
            type: "chat_message",
            data: {
                body: newMessage,
                name: me?.nickname,
                sent_to_id: otherUser?.id,
                conversation_id: conversation.id,
            },
        });
        setnewMessage("");

        setTimeout(() => {
            scrollToBottom();
        }, 50);
    };

    const scrollToBottom = () => {
        if (messageDiv.current) {
            messageDiv.current.scrollTop = messageDiv.current.scrollHeight;
        }
    };

    return (
        <>
            <div className="bg-white p-4 shadow">
                <h1 className="text-xl font-bold">
                    Conversation avec {otherUser?.nickname}
                </h1>
                <button
                    onClick={async () => {
                        if (
                            confirm(
                                "Êtes-vous sûr de vouloir supprimer cette conversation ?"
                            )
                        ) {
                            await api
                                .delete(`chat/${conversation.id}/delete/`)
                                .then(() => router.push("/inbox"));
                        }
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition mt-2"
                >
                    Supprimer la conversation
                </button>
            </div>

            <div
                ref={messageDiv}
                className="h-screen overflow-auto flex flex-col space-y-4"
            >
                {oldMessages?.map((message, index) => (
                    <div
                        key={index}
                        className={`flex flex-col overflow-y-auto w-[80%] p-4 rounded-xl ${
                            message.author.id === me?.id
                                ? "ml-[20%] bg-blue-200"
                                : "bg-gray-200"
                        }`}
                    >
                        <div className="font-semibold">
                            {me?.nickname == message.author.nickname
                                ? "vous"
                                : message.author.nickname}
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow">
                            {message.body}
                        </div>
                    </div>
                ))}

                {messages?.map((message, index) => (
                    <div
                        key={index}
                        className={`overflow-y-auto w-[80%] p-4 rounded-xl ${
                            message.name === me?.nickname
                                ? "ml-[20%] bg-blue-200"
                                : "bg-gray-200"
                        }`}
                    >
                        <div className="font-semibold">
                            {me?.nickname == message.name
                                ? "vous"
                                : message.name}
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow">
                            {message.body}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white shadow-lg">
                <div className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setnewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow border border-gray-300 rounded-lg p-2"
                    />
                    <button
                        onClick={sendMessage}
                        className="ml-2 bg-blue-500 text-white rounded-lg px-4"
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
};

export default ConversationDetail;
