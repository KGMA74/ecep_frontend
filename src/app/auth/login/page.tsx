"use client"

import LoginForm from "@/components/form/LoginForm";
import {useLogin, useRegister } from "@/hooks/";
import { useAppSelector } from "@/redux/hooks";

const Page = () => {

  const {isAuthenticated} = useAppSelector((state) => state.auth);
  const { loginSubmit, isLoading } = useLogin()

  return (
    <div className="flex w-full h-full justify-center items-center">
      <LoginForm submitHandler={loginSubmit} isLoading={isLoading}/>
    </div>
  );
};

export default Page;
