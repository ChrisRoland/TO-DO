// src/routes/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  CheckSquare,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
} from "lucide-react";
import SEO from "../components/SEO";

export default function Register() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      setError("");
      setSuccess("");

      if (value.password !== value.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // eslint-disable-next-line no-unused-vars
      const { data, error } = await signUp(
        value.email,
        value.password,
        value.fullName
      );

      if (error) {
        setError(error);
      } else {
        setSuccess(
          "Account created! Please check your email to verify your account."
        );
        // Auto redirect to app after successful signup
        setTimeout(() => {
          navigate({ to: "/app" });
        }, 2000);
      }

      setIsLoading(false);
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    const { error } = await signInWithGoogle();

    if (error) {
      setError(error);
      setIsLoading(false);
    }
    // Note: Google auth will redirect, so we don't need to handle success here
  };

  return (
    <>
      <SEO
        title="Sign Up - T0+D0"
        description="Create your T0+D0 account and start organizing your todos with our powerful productivity app"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <CheckSquare className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                T0 + D0
              </h1>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Join thousands organizing their life with T0+D0
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-center text-xl">
                Get started for free
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {success}
                  </p>
                </div>
              )}

              {/* Registration Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-4"
              >
                <form.Field
                  name="fullName"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value || !value.trim())
                        return "Full name is required";
                      if (value.trim().length < 2)
                        return "Name must be at least 2 characters";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isLoading}
                        />
                      </div>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "Email is required";
                      if (!/\S+@\S+\.\S+/.test(value))
                        return "Please enter a valid email";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isLoading}
                        />
                      </div>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "Password is required";
                      if (value.length < 6)
                        return "Password must be at least 6 characters";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "Please confirm your password";
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          className="pl-10"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isLoading}
                        />
                      </div>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-500">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit]) => (
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!canSubmit || isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  )}
                </form.Subscribe>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            </CardContent>

            <CardFooter className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>

          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
