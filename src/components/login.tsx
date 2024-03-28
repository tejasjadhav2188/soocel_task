
import { useState } from "react";
import loginimg from "../assets/login.png"
import { Eye, EyeOff } from "lucide-react"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email("Email Format is Invalid"),
  password: z.string()
    .min(6, {message: 'Password must be at least 6 characters'})
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  checkbox: z.boolean(),
})

type FormFields = z.infer<typeof formSchema>;

const LoginPage = () => {

  const [pwdVisibility, setPwdVisibility] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })
  const toggle = () => setPwdVisibility(!pwdVisibility);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {

    try{
      const da = {
        "username":data.email.slice(0,data.email.indexOf("@")),
        "password":data.password
      }
      console.log(data)

      const response = await axios.post('https://dummyjson.com/auth/login',da)

      if(!response){
        setError("root", {
          message: "Server down try later",
        });
      }

      if(response && data.checkbox){
        
        const authorized = response.data.token;
        localStorage.setItem('token', authorized);
      }
      navigate('/dashboard');
    }catch(error){
      console.log(error)
      setError("root", {
        message: "Invalid credentials! Check your Email andl Password",
      });
    }
  }

  return (
    <div className=" flex h-screen ">
      <div className="w-7/12 overflow-y-clip hidden lg:block">

        <img className="w-screen -translate-y-72   " src={loginimg} alt="Login Page Image" />;
      </div>

      <div className="mt-14 m-auto lg:pl-32 lg:pr-24 lg:w-5/12">
        <h1 className="mt-11  font-bold text-5xl text-black">Login</h1>
        <p className="mt-4 text-slate-500 text-sm">Login your account in seconds</p>



        <form className="mt-6 " onSubmit={handleSubmit(onSubmit)} method="POST">
          <div className="min-w-full border-2 border-zinc-300  p-4  flex items-center rounded-lg ">

            <input
              {...register("email")}
              className="min-w-full outline-none"
              name="email"
              type="email"
              placeholder="Email Address"
              required
            />
            </div>
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          <div className="min-w-full border-2 border-zinc-300  p-4 mt-10 flex items-center justify-between rounded-lg ">

            <input
              {...register("password")}
              className="outline-none min-w-ful"
              name="password"
              type={pwdVisibility ? "text" : "password"}
              placeholder="Password"
              required
            />


            <button type="button" onClick={toggle}>
              {pwdVisibility ? <Eye color="#808080" /> : <EyeOff color="#808080" />}

            </button>
          </div>
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
          <div className="flex items-center justify-between mt-12 gap-3">
            <div className="text-gray-500 text-sm gap-4 flex items-center ">
              <input {...register("checkbox")} type="checkbox" name="checkbox" className="w-6 h-6" />
              <label>Keep me logged in</label>
            </div>
            <div>
              <p className="text-[#7754F6] text-md font-medium">Forget password?</p>
            </div>
          </div>
          <div className="bg-[#7754F6] rounded-lg p-4 mt-8 flex items-center justify-center text-white font-bold">
            <button 
              className="w-full"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Logging In" : "Log in"}
            </button>
          </div>
          {errors.root && <div className="text-red-500">{errors.root.message}</div>}
        </form>
        <div className="mt-8">
          <p>Don't have and account? <span className="text-[#7754F6] font-semibold">Sign up</span></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;