import { useRouter } from "next/navigation";

const redirectLogin = () => {
    const router = useRouter();
    router.push("/auth/login-register");
}

export default redirectLogin;