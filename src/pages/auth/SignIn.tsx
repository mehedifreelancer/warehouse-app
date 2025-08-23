import React, { useRef, useState } from "react";
import logo from "../../assets/images/logo.svg";
import Button from "../../components/ui/Button";
import { authFormSchema } from "../../schemas/auth/signin.schema";
import { signIn } from "../../services/auth/signin.service";
import { toastCustom } from "../../components/ui/CustomToast";
import { ToastContainer } from "react-toastify";
import { handleToken } from "../../utils/handleToken";
import { useNavigate } from "react-router-dom";
import InputText from "../../components/ui/input/InputText";

interface LoginPayload {
  username: string;
  password: string;
  rememberMe?: boolean;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formValidationErrors, setFormValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("rememberMe") === "on";

    const payload: LoginPayload = {
      username: username,
      password: password,
      rememberMe: rememberMe,
    };
    console.log("Form Data Submitted:", payload);
    

    const result = authFormSchema.safeParse(payload);
    if (!result.success) {
      setFormValidationErrors(result.error.flatten().fieldErrors);
      // Don't return here - let the form keep its values naturally
      console.log(result.error.flatten().fieldErrors);
      
      return;
    }

    try {
      const confirmation = await signIn(payload);
      if (confirmation?.status === 200) {
        try {
          handleToken(confirmation?.data?.token);
          navigate("/");
        } catch {
          navigate("/auth/signin");
        }
      }
    } catch (err: any) {
      toastCustom({
        title: "Login Failed",
        message:
          err.response?.data?.message || "An error occurred during sign-in",
        type: "error",
        duration: 5000,
      });
      // Reset the form only on successful submission
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <ToastContainer />
      <div
        style={{ backgroundImage: `url("/images/bg.jpg")` }}
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
      />
      <div
        className="auth-form relative z-10 w-full max-w-lg rounded-lg shadow-sm border border-white/20 bg-white/5 backdrop-blur-lg transition-transform duration-700 ease-out"
        style={{
          transform: "translateY(100px)",
          animation: "slideUp 1s forwards",
        }}
      >
        <style>
          {`
            @keyframes slideUp {
              to { transform: translateY(0); }
            }
          `}
        </style>

        <div className="py-5 border-b border-gray-300/20 text-center">
          {/* <img className="z-10 w-[30%] mx-auto" src={logo} alt="logo" /> */}
          <h1 className="font-bold text-white dark:text-[#cAcAcA] text-3xl">BILS</h1>
        </div>

        <form 
          action={handleSubmit} 
          className="space-y-8 p-8"
          ref={formRef}
          noValidate // Prevent browser validation which might interfere
        >
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <InputText
              className="text-white! placeholder-opacity-100"
              name="username"
              placeholder="abc@xyz.com"
              defaultValue="" // Allows the DOM to manage the value
              checkErrorField={formValidationErrors.email}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <InputText
              className="text-white !"
              name="password"
              placeholder="*********"
              type="password"
              defaultValue="" // Allows the DOM to manage the value
              checkErrorField={formValidationErrors.password}
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                className="mr-2 leading-tight"
              />
              Remember Me
            </label>
          </div>
          <Button
            type="submit"
            className="btn-gradient-active w-full text-center text-white justify-center font-semibold p-3!"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;