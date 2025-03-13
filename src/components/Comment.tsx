import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaRegComment, FaSpinner } from "react-icons/fa";
import { api } from "@/utils/api";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import type { postType, voteType } from "@/utils/type";
import Link from "next/link";

interface Props {
  comment: postType; // Un commentaire est de type postType
  parentId?: number; // ID du commentaire parent pour les réponses
}

const Comment: React.FC<Props> = ({ comment, parentId }) => {
  const { data: user } = useRetrieveUserQuery();
  const [userVote, setUserVote] = useState<voteType | null>(null);
  const [voteStatus, setVoteStatus] = useState<string>("");
  const [commentsNbr, setCommentsNbr] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [reply, setReply] = useState<string>("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [responses, setResponses] = useState<postType[]>([]);
  const [showReplyInput, setShowReplyInput] = useState(false); // État pour afficher/masquer le champ de réponse

  const fetchUserVote = useCallback(async () => {
    try {
      const userVoteData = await api
        .get(`posts/${comment.id}/user/${user?.id}/vote/`)
        .json<voteType>();
      setUserVote(userVoteData);
      setVoteStatus(userVoteData.type);
    } catch (error) {
      console.error("Failed to fetch user vote:", error);
    }
  }, [comment.id, user?.id]);

  const fetchVotes = useCallback(async () => {
    try {
      const { upvotes, downvotes } = await api
        .get(`posts/${comment.id}/votes/all/`)
        .json<{ upvotes: number; downvotes: number }>();
      setUpvotes(upvotes);
      setDownvotes(downvotes);
    } catch (error) {
      console.error("Failed to fetch votes:", error);
    }
  }, [comment.id]);

  const fetchCommentsNbr = useCallback(async () => {
    try {
      const commentsData = await api
        .get(`posts/${comment.id}/comments_number/`)
        .json<{ totalComments: number }>();
      setCommentsNbr(commentsData.totalComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  }, [comment.id]);

  const fetchResponses = useCallback(async () => {
    try {
      const responsesData = await api
        .get(`comments/${comment.id}/responses/`) 
        .json<postType[]>();
      setResponses(responsesData);
      fetchCommentsNbr();
    } catch (error) {
      console.error("Failed to fetch responses:", error);
    }
  }, [comment.id, fetchCommentsNbr]);

  const handleVote = async (voteType: string) => {
    setLoading(true);
    try {
      if (!userVote) {
        await api.post(`vote/`, {
          json: { author: user?.id, post: comment.id, type: voteType },
        });
      } else if (userVote.type === voteType) {
        await api.delete(`unvote/${userVote.id}/`);
        setUserVote(null);
        setVoteStatus("");
      } else {
        await api.put(`update-vote/${userVote.id}/`, {
          json: { ...userVote, type: voteType },
        });
        setVoteStatus(voteType);
      }
      await fetchUserVote();
      await fetchVotes();
    } catch (error) {
      console.error("Failed to handle vote:", error);
    }
    setLoading(false);
  };

  const handleReply = async () => {
    setLoadingReply(true);
    try {
      await api.post(`posts/create/`, {
        json: {
          author: user?.id,
          parent_post: comment.id,
          details: reply,
          category: "Comment",
        },
      });
      setReply(""); // Réinitialisez le champ de réponse
      setShowReplyInput(false); // Masquez le champ de réponse
      fetchResponses(); // Rafraîchir les réponses
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
    setLoadingReply(false);
  };

  useEffect(() => {
    fetchUserVote();
    fetchVotes();
    fetchCommentsNbr();
    fetchResponses();
  }, [fetchUserVote, fetchCommentsNbr, fetchVotes, fetchResponses]);

  return (
    <div className="flex flex-col p-4 border-b border-gray-200">
      <Link
        href={`/post/${comment.id}`}
        className="text-gray-500 hover:text-gray-700 flex items-center space-x-2"
      >
        <div className="flex items-start">
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden border">
            <Image
              src={comment.author.photo || `/moi.png`}
              alt="profile"
              width={50}
              height={50}
              priority
              className="object-cover"
            />
          </div>
          <div className="ml-4 flex-grow">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {comment.author.user.nickname}
                </p>
                <p className="text-xs text-gray-500">
                  Posté le {new Date(comment.created).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{comment.details}</p>

            {/* Vote Buttons and Counts */}
            <div className="flex items-center space-x-4 mt-2">
              <button
                onClick={() => handleVote("upvote")}
                className={`text-blue-500 hover:text-blue-600 transition duration-150 ${voteStatus === "upvote" && "text-blue-800"}`}
              >
                {loading && voteStatus === "upvote" ? (
                  <FaSpinner className="animate-spin" size={20} />
                ) : (
                  <AiOutlineLike size={20} />
                )}
              </button>
              <span className="text-sm">{upvotes}</span>

              <button
                onClick={() => handleVote("downvote")}
                className={`text-red-500 hover:text-red-600 transition duration-150 ${voteStatus === "downvote" && "text-red-800"}`}
              >
                {loading && voteStatus === "downvote" ? (
                  <FaSpinner className="animate-spin" size={20} />
                ) : (
                  <AiOutlineDislike size={20} />
                )}
              </button>
              <span className="text-sm">{downvotes}</span>

              <FaRegComment size={20} />
              <span className="text-sm">{commentsNbr}</span>
            </div>
          </div>
        </div>
      </Link>
      {/* Bouton Répondre */}
      <button
        onClick={() => setShowReplyInput((prev) => !prev)} // Alterne la visibilité
        className="mt-2 text-blue-500 hover:text-blue-600"
      >
        {showReplyInput ? "Annuler" : "Répondre"}
      </button>

      {/* Formulaire de réponse */}
      {showReplyInput && (
        <div className="mt-4">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Écrivez votre réponse..."
          />
          <button
            onClick={handleReply}
            disabled={loadingReply || !reply.trim()}
            className={`mt-2 px-4 py-2 text-white bg-blue-600 rounded ${loadingReply && "opacity-50 cursor-not-allowed"}`}
          >
            {loadingReply ? <FaSpinner className="animate-spin" /> : "Répondre"}
          </button>
        </div>
      )}

      {/* Affichage des réponses */}
      <div className="mt-4">
        {responses.map((response) => (
          <Comment key={response.id} comment={response} />
        ))}
      </div>
    </div>
  );
};

export default Comment;
