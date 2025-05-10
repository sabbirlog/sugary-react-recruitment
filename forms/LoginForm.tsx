"use client"

import { userLogin } from "@/api/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const loginSchema = z.object({
  UserName: z.string().min(1, { message: "UserName is required" }),
  Password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      UserName: "",
      Password: "",
    },
  })

  const mutation = useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      Cookies.set("token", data.Token, {
        path: "/",
        sameSite: "Lax",
      })
      localStorage.setItem('user', JSON.stringify(data.User));
      if(data.Success) {
        router.push('/dashboard');
      }
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    mutation.mutate(data)
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
      <div className="bg-gradient-to-r from-[var(--teal-400)] to-[var(--emerald-500)] p-6">
        <h2 className="text-center text-2xl font-bold text-white">Welcome Back</h2>
        <p className="mt-2 text-center text-sm text-white/80">Sign in to access your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="UserName" className="text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="UserName"
              type="text"
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-4 py-3 text-slate-700 outline-none transition-colors focus:border-[var(--teal-500)] focus:ring-2 focus:ring-[var(--teal-500)]/20 ${
                errors.UserName ? "border-red-500 bg-red-50" : "border-slate-200"
              }`}
              {...register("UserName")}
              disabled={mutation.isPending}
            />
            {errors.UserName && <p className="mt-1 text-sm text-red-500">{errors.UserName.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="Password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                id="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-3 pr-10 text-slate-700 outline-none transition-colors focus:border-[var(--teal-500)] focus:ring-2 focus:ring-[var(--teal-500)]/20 ${
                  errors.Password ? "border-red-500 bg-red-50" : "border-slate-200"
                }`}
                {...register("Password")}
                disabled={mutation.isPending}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.Password && (
              <div className="mt-1 space-y-1 text-sm text-red-500">
                {errors.Password.message?.split(". ").map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[var(--teal-500)] to-[var(--emerald-600)] px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-[var(--teal-600)] hover:to-[var(--emerald-700)] focus:outline-none focus:ring-2 focus:ring-[var(--teal-500)] focus:ring-offset-2 disabled:opacity-70"
          >
            {mutation.isPending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
