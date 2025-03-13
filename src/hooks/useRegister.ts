import { FormEvent } from "react";
import { useRegisterMutation } from "@/redux/features/authApiSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const useRegister = () => {
    const router = useRouter();
    const [register, { isLoading }] = useRegisterMutation();
    const registerSubmit = async (event: FormEvent<HTMLFormElement>, role: string) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const firstname = form["firstname"].value;
        const lastname = form["lastname"].value;
        const email = form["email"].value;

        // const specialty = form["specialty"].value ?? '';
        const subject = role==='teacher' ? form["subject"].value : '';
        const password = form["password"].value;
        const re_password = form["re_password"].value;

        if (password != re_password) {
            //register_error  = "password aren't the s
        }

        register({ firstname, lastname, email, password, re_password, subject})
            .unwrap()
            .then(() => {
                toast.success("Please check your email to verify account");
                router.refresh()
            })
            .catch((err) => {
                const err_msg = err.data.fullname || err.data.email || err.data.password || err.data.non_field_errors || ""
                toast.error("Failed to register account! \n"+err_msg);
            });
    };
    return {
        registerSubmit,
        isLoading,
    };
};
export default useRegister;
