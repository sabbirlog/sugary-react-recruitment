"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"


const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Must be a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)

    // Simulate API call
    console.log("Form data:", data)

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    // Here you would typically handle authentication
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
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-4 py-3 text-slate-700 outline-none transition-colors focus:border-[var(--teal-500)] focus:ring-2 focus:ring-[var(--teal-500)]/20 ${
                errors.email ? "border-red-500 bg-red-50" : "border-slate-200"
              }`}
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-3 pr-10 text-slate-700 outline-none transition-colors focus:border-[var(--teal-500)] focus:ring-2 focus:ring-[var(--teal-500)]/20 ${
                  errors.password ? "border-red-500 bg-red-50" : "border-slate-200"
                }`}
                {...register("password")}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <div className="mt-1 space-y-1 text-sm text-red-500">
                {errors.password.message?.split(". ").map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[var(--teal-500)] to-[var(--emerald-600)] px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-[var(--teal-600)] hover:to-[var(--emerald-700)] focus:outline-none focus:ring-2 focus:ring-[var(--teal-500)] focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? (
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
