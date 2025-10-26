"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface AuthCardProps {
  isLoginPage: boolean
}

export function AuthCard({ isLoginPage }: AuthCardProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
        <h1 className="text-3xl font-normal text-white mb-8">
          {isLoginPage ? "Welcome Back" : "Create an Account"}
        </h1>

        <form className="space-y-4">
          {!isLoginPage && (
            <div className="grid grid-cols-2 gap-4">
              <Input type="text" placeholder="First Name" />
              <Input type="text" placeholder="Last Name" />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-12"
            />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {isLoginPage && (
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-black/20 text-white"
                />
                <span className="text-white/60 text-sm">Remember me</span>
              </label>
              <Link href="#" className="text-white/60 hover:text-white text-sm">
                Forgot password?
              </Link>
            </div>
          )}

          <Button type="submit" className="w-full h-14 mt-8">
            {isLoginPage ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-4 text-white/40 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        
        <div className="text-center">
            {isLoginPage ? (
                <p className="text-white/60 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-orange-400 hover:underline">
                        Sign up
                    </Link>
                </p>
            ) : (
                <p className="text-white/60 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-orange-400 hover:underline">
                        Sign in
                    </Link>
                </p>
            )}
        </div>
      </div>
    </div>
  )
}
