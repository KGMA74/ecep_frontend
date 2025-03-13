'use client';

import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: me, isLoading } = useRetrieveUserQuery();
    const router = useRouter();

    useEffect(() => {
    }, [isLoading, me, router]);

    return <>
    { me?.role === 'admin'? ( 
        children 
    ): (
        <div className="flex w-full h-full items-center justify-center">
            <p>You haven't the require role to be here</p>
        </div>
    )}
    </>;
};

export default RequireAuth;
