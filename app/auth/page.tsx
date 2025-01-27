'use client';

import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { NeutronIcon } from '@/components/ui/icon';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User } from 'lucide-react';
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from '@/lib/schemas/auth';
import { auth } from '@/actions/auth';
import { LoadingDots } from '@/components/ui/loading-dots';
import { useActionState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Testimonials } from '@/components/ui/testimonials';
// import { redirect, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { useSplashStore } from '@/store/use-splash-store';
// import { HeroPill } from "@/components/ui/hero-pill"

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type='submit' className='w-full' disabled={isPending}>
      {isPending ? (
        <Fragment>
          <span className='mr-2'>Authenticating</span>
          <LoadingDots />
        </Fragment>
      ) : (
        <span>Continue</span>
      )}
    </Button>
  );
}

// function AuthPill() {
//   return (
//     <HeroPill
//       href="/blog/introducing-neutron"
//       label="Introducing Neutron"
//     />
//   )
// }

function TermsModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          variant='link'
          className='px-0 underline underline-offset-4 hover:text-primary'
        >
          Terms of Service
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Terms of Service</ModalTitle>
        </ModalHeader>
        <div className='space-y-4'>
          <p>Your terms of service content here...</p>
        </div>
      </ModalContent>
    </Modal>
  );
}

function PrivacyModal() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button
          variant='link'
          className='px-0 underline underline-offset-4 hover:text-primary'
        >
          Privacy Policy
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Privacy Policy</ModalTitle>
        </ModalHeader>
        <div className='space-y-4'>
          <p>Your privacy policy content here...</p>
        </div>
      </ModalContent>
    </Modal>
  );
}

export default function AuthPage() {

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const [loginError, loginAction, isLoginPending] = useActionState(
    async (_: null | string, formData: FormData) => {
      const result = await auth(formData, 'login');
      if (result?.error) {
        toast.error(result.error);
        return result.error;
      }
      if (result?.success) {
        useSplashStore.getState().showSplash('login');
      }
      // redirect(returnTo)
      return null;
    },
    null
  );

  const [registerError, registerAction, isRegisterPending] = useActionState(
    async (_: null | string, formData: FormData) => {
      const name = registerForm.getValues('name');
      if (name) {
        formData.append('name', name);
      }
      const result = await auth(formData, 'register');
      if (result?.error) {
        toast.error(result.error);
        return result.error;
      }
      if (result?.success) {
        useSplashStore.getState().showSplash('register');
      }
      // redirect(returnTo)
      return null;
    },
    null
  );

  return (
    <div className='container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col bg-muted p-10 bg-zinc-900 text-white lg:flex dark:border-r'>
        <Testimonials />
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          {/* <div className="flex justify-center">
            <AuthPill />
          </div> */}
          <Card className='border-none shadow-none'>
            <CardHeader className='space-y-1'>
              <div className='flex items-center justify-center gap-2'>
                <NeutronIcon className='h-8 w-8' />
                <CardTitle className='text-2xl font-bold'>Welcome</CardTitle>
              </div>
              <CardDescription className='text-center'>
                Choose how you want to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue='login' className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='login'>Login</TabsTrigger>
                  <TabsTrigger value='register'>Register</TabsTrigger>
                </TabsList>
                <AnimatePresence mode='popLayout'>
                  <TabsContent value='login' key='login'>
                    <motion.div
                      key='login-motion'
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Form {...loginForm}>
                        <form action={loginAction} className='space-y-4'>
                          {/* Login form fields */}
                          <FormField
                            control={loginForm.control}
                            name='email'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className='relative'>
                                    <Input
                                      {...field}
                                      type='email'
                                      placeholder='name@example.com'
                                      className='pl-10'
                                    />
                                    <Mail
                                      className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                                      size={18}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={loginForm.control}
                            name='password'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <div className='relative'>
                                    <Input
                                      {...field}
                                      type='password'
                                      placeholder='••••••••'
                                      className='pl-10'
                                    />
                                    <Lock
                                      className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                                      size={18}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <SubmitButton isPending={isLoginPending} />
                        </form>
                      </Form>
                    </motion.div>
                  </TabsContent>
                  <TabsContent value='register' key='register'>
                    <motion.div
                      key='register-motion'
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Form {...registerForm}>
                        <form action={registerAction} className='space-y-4'>
                          {/* Register form fields */}
                          <FormField
                            control={registerForm.control}
                            name='name'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <div className='relative'>
                                    <Input
                                      {...field}
                                      type='text'
                                      placeholder='John Doe'
                                      className='pl-10'
                                    />
                                    <User
                                      className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                                      size={18}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name='email'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className='relative'>
                                    <Input
                                      {...field}
                                      type='email'
                                      placeholder='name@example.com'
                                      className='pl-10'
                                    />
                                    <Mail
                                      className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                                      size={18}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name='password'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <div className='relative'>
                                    <Input
                                      {...field}
                                      type='password'
                                      placeholder='••••••••'
                                      className='pl-10'
                                    />
                                    <Lock
                                      className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                                      size={18}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <SubmitButton isPending={isRegisterPending} />
                        </form>
                      </Form>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
              {(loginError || registerError) && (
                <p className='text-sm text-destructive text-center mt-4'>
                  {loginError || registerError}
                </p>
              )}
            </CardContent>
          </Card>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            By clicking continue, you agree to our <TermsModal /> and{' '}
            <PrivacyModal />.
          </p>
        </div>
      </div>
    </div>
  );
}
