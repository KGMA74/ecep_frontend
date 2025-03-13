"use client";
import { useState, useEffect, useCallback } from "react";
import type { ProfileType } from "@/utils/type";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";

const EditProfile = ({ userId }: { userId: string }) => {
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [newNickname, setNewNickname] = useState<string>("");
    const [newBio, setNewBio] = useState<string>("");
    const [newEmail, setNewEmail] = useState<string>("");
    const [newSkills, setNewSkills] = useState<{ id: number; name: string }[]>([]);
    const [newSkill, setNewSkill] = useState<string>("");
    const [newExperience, setNewExperience] = useState({ name: "", detail: "", start_date: "", end_date: "" });
    const [newEducation, setNewEducation] = useState({ name: "", detail: "", graduation_date: "" });
    const router = useRouter();

    const getProfile = useCallback(async () => {
        setLoading(true);
        try {
            const profileData = await api.get(`profiles/${userId}/`).json<ProfileType>();
            setProfile(profileData);
            setNewNickname(profileData.user.nickname || "");
            setNewBio(profileData.bio || "");
            setNewEmail(profileData.user.email || "");
            setNewSkills(profileData.skills || []);
        } catch (error) {
            console.error("Échec de la récupération du profil :", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const handleUpdateProfile = async () => {
        try {
            const profileData = await api.get(`profiles/${userId}/`).json<ProfileType>();
            setProfile(profileData);
            setNewBio(profileData.bio || "");
            setNewEmail(profileData.user.email || "");
            setNewSkills(profileData.skills || []);
            await api.put(`update-profile/${userId}/`, { json: profileData });
            router.push(`/users-profile/${userId}`);
        } catch (error) {
            console.error("Échec de la mise à jour du profil :", error);
        }
    };

    const handleAddExperience = async () => {
        try {
            await api.post(`new/experience/`, { json: { ...newExperience, profile: userId } });
            setNewExperience({ name: "", detail: "", start_date: "", end_date: "" }); // Reset fields
            getProfile(); // Refresh profile data
        } catch (error) {
            console.error("Échec de l'ajout de l'expérience :", error);
        }
    };

    const handleAddEducation = async () => {
        try {
            await api.post(`new/education/`, { json: { ...newEducation, profile: userId } });
            setNewEducation({ name: "", detail: "", graduation_date: "" }); // Reset fields
            getProfile(); // Refresh profile data
        } catch (error) {
            console.error("Échec de l'ajout de l'éducation :", error);
        }
    };

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Profile not found.</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
                {/* Nickname, Bio, Email Inputs */}
                <div className="mb-4">
                    <label className="block text-gray-700">Nickname</label>
                    <input
                        type="text"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Bio</label>
                    <textarea
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>

                {/* Skills Input */}
                <div className="mb-4">
                    <label className="block text-gray-700">Skills</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {newSkills.map((skill) => (
                            <div key={skill.id} className="flex items-center">
                                <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => {
                                        const updatedSkills = newSkills.map((s) =>
                                            s.id === skill.id ? { ...s, name: e.target.value } : s
                                        );
                                        setNewSkills(updatedSkills);
                                    }}
                                    className="border rounded p-2"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="border rounded p-2 w-full"
                            placeholder="Ajouter une compétence"
                        />
                        <button
                            onClick={() => {
                                if (newSkill) {
                                    const updatedSkills = [
                                        ...newSkills,
                                        { id: Date.now(), name: newSkill },
                                    ];
                                    setNewSkills(updatedSkills);
                                    setNewSkill(""); // Réinitialiser le champ d'entrée
                                }
                            }}
                            className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Ajouter
                        </button>
                    </div>
                </div>

                {/* Experience Input */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Add Experience</h2>
                    <input
                        type="text"
                        value={newExperience.name}
                        onChange={(e) => setNewExperience({ ...newExperience, name: e.target.value })}
                        placeholder="Experience Name"
                        className="border rounded p-2 w-full mb-2"
                    />
                    <textarea
                        value={newExperience.detail}
                        onChange={(e) => setNewExperience({ ...newExperience, detail: e.target.value })}
                        placeholder="Experience Detail"
                        className="border rounded p-2 w-full mb-2"
                    />
                    <input
                        type="date"
                        value={newExperience.start_date}
                        onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
                        className="border rounded p-2 w-full mb-2"
                    />
                    <input
                        type="date"
                        value={newExperience.end_date}
                        onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
                        className="border rounded p-2 w-full mb-2"
                    />
                    <button
                        onClick={handleAddExperience}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Add Experience
                    </button>
                </div>

                {/* Education Input */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Add Education</h2>
                    <input
                        type="text"
                        value={newEducation.name}
                        onChange={(e) => setNewEducation({ ...newEducation, name: e.target.value })}
                        placeholder="Education Name"
                        className="border rounded p-2 w-full mb-2"
                    />
                    <textarea
                        value={newEducation.detail}
                        onChange={(e) => setNewEducation({ ...newEducation, detail: e.target.value })}
                        placeholder="Education Detail"
                        className="border rounded p-2 w-full mb-2"
                    />
                    <input
                        type="date"
                        value={newEducation.graduation_date}
                        onChange={(e) => setNewEducation({ ...newEducation, graduation_date: e.target.value })}
                        className="border rounded p-2 w-full mb-2"
                    />
                    <button
                        onClick={handleAddEducation}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Add Education
                    </button>
                </div>

                <button
                    onClick={handleUpdateProfile}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Update Profile
                </button>
            </div>
        </div>
    );
};

export default EditProfile;
