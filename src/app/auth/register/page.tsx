"use client"
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import LoginForm from "@/components/form/LoginForm";
import RegisterForm from "@/components/form/RegisterForm";
import {useLogin, useRegister } from "@/hooks/";
import { useAppSelector } from "@/redux/hooks";

const Page = () => {

  const {isAuthenticated} = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { registerSubmit, isLoading } = useRegister();

  return (
    <div className="flex w-full h-full justify-center items-center">
      <RegisterForm submitHandler={registerSubmit} isLoading={isLoading}/>
    </div>
  );
};

export default Page;
