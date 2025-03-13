import { Profile, Student, Teacher } from "@/utils/type";
import { apiSlice } from "../services/apiSlice";

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    profile: Profile | null;
    student: Student | null;
    teacher: Teacher | null;
    parent: Teacher | null;
}

interface SocialAuthArgs {
    provider: string;
    state: string;
    code: string;
}

interface CreateUserResponse {
    success: boolean;
    user: User;
}

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        retrieveUser: builder.query<User, void>({
            query: () => "/users/me/",
        }),

        socialAuthenticate: builder.mutation({
            //this part for so
            query: ({ provider, state, code }: SocialAuthArgs) => ({
                url: `/o/${provider}?state=${encodeURIComponent(
                    state
                )}&code=${encodeURIComponent(code)}/`,
                method: "POST",
                headers: {
                    accept: "application/json",
                    "content-type": "application/x-www-form-urlencoded",
                },
            }),
        }),

        //login
        login: builder.mutation({
            query: (credential: { email: string; password: string }) => ({
                url: "/jwt/create/",
                method: "POST",
                body: credential,
            }),
        }),
        
        //logout
        logout: builder.mutation({
            query: () => ({
                url: 'logout/',
                method: 'POST'
            }),
        }),

        //verify
        verify: builder.mutation({
            query: () => ({
                url: "/jwt/verify/",
                method: "POST",
            }),
        }),

        //register
        register: builder.mutation({
            query: (credential: {
                firstname: string;
                lastname: string;
                email: string;
                password: string;
                re_password: string;
                specialty?: string;
                subject?: string;
                
            }) => ({
                url: "/users/",
                method: "POST",
                body: credential,
            }),
        }),

        //activation
        activation: builder.mutation({
            query: ({ uid, token }: {uid: string, token: string}) => ({
                url: `/users/activation/`,
                method: "POST",
                body: { uid, token },
            }),
        }),

        //resetPassword
        resetPassword: builder.mutation({
            query: (email: string) => ({
                url: `/users/reset_password/`,
                method: "POST",
                body: { email },
            }),
        }),

        //resetPasswordConfirm
        resetPasswordConfirm: builder.mutation({
            query: ({ uid, token, new_password, re_new_password }) => ({
                url: `/users/reset_password_confirm/`,
                method: "POST",
                body: { uid, token, new_password, re_new_password },
            }),
        }),

        //--------------- others endpoints ----------------

        // retrieveUserbyId
        RetrieveUserById: builder.mutation<User, number>({
            query: (id: number) => ({
                url: `/users/${id}/`,
                method: "GET",
            }),
        })
    }),
});

export const{
    useRetrieveUserQuery,
    useRetrieveUserByIdMutation,
    useSocialAuthenticateMutation,
    useLoginMutation,
    useLogoutMutation,
    useVerifyMutation,
    useRegisterMutation,
    useActivationMutation,
    useResetPasswordMutation,
    useResetPasswordConfirmMutation,
  } = authApiSlice;