import { FC, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth, loginSchema, registerSchema } from "@/hooks/useAuth";
import { Redirect } from "wouter";

const Auth: FC = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  
  // Define forms using hooks
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      accountType: "individual" as const,
      role: "user"
    }
  });
  
  // Handle form submissions
  const onLoginSubmit = loginForm.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  const onRegisterSubmit = registerForm.handleSubmit((data) => {
    registerMutation.mutate(data);
  });
  
  // Redirect if already logged in - after all hooks are called
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Form Section */}
            <div className="p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                  Welcome to Tekevwe Legal
                </h2>
                <p className="text-gray-600 mb-8">
                  Sign in to your account to access legal documents, templates, and AI tools
                </p>
                
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Login</CardTitle>
                        <CardDescription>
                          Enter your credentials to access your account
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...loginForm}>
                          <form onSubmit={onLoginSubmit} className="space-y-4">
                            <FormField
                              control={loginForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="********" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit" 
                              className="w-full" 
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Logging in...
                                </>
                              ) : (
                                "Login"
                              )}
                            </Button>
                          </form>
                        </Form>
                        
                        <div className="mt-4 text-center text-sm">
                          <span className="text-gray-600">
                            Don't have an account?{" "}
                            <button 
                              className="text-blue-600 hover:underline"
                              onClick={() => setActiveTab("register")}
                            >
                              Register now
                            </button>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create an Account</CardTitle>
                        <CardDescription>
                          Fill in your information to get started
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...registerForm}>
                          <form onSubmit={onRegisterSubmit} className="space-y-4">
                            <FormField
                              control={registerForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="email@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="********" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="accountType"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel>Account Type</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex flex-col space-y-1"
                                    >
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="student" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          Student
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="individual" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          Individual
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="business" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          Business
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit" 
                              className="w-full"
                              disabled={registerMutation.isPending}
                            >
                              {registerMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating account...
                                </>
                              ) : (
                                "Register"
                              )}
                            </Button>
                          </form>
                        </Form>
                        
                        <div className="mt-4 text-center text-sm">
                          <span className="text-gray-600">
                            Already have an account?{" "}
                            <button 
                              className="text-blue-600 hover:underline"
                              onClick={() => setActiveTab("login")}
                            >
                              Login here
                            </button>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Hero Section */}
            <div className="hidden lg:block bg-indigo-600 p-12 text-white relative">
              <div className="absolute inset-0 bg-black opacity-20" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">
                  Your AI-Powered Legal Assistant
                </h3>
                <p className="mb-6">
                  Tekevwe combines cutting-edge AI with deep legal expertise to help you:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-indigo-300 mr-2" />
                    <span>Generate legal documents tailored to provincial laws</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-indigo-300 mr-2" />
                    <span>Analyze legal risks in your contracts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-indigo-300 mr-2" />
                    <span>Access up-to-date legal research across all provinces</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-6 w-6 text-indigo-300 mr-2" />
                    <span>Collaborate seamlessly with team members</span>
                  </li>
                </ul>
                <p className="text-sm opacity-80">
                  Tailored for students, individuals, and business users across Canada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;