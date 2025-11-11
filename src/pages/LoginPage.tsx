import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/api'

interface LoginForm {
  username: string
  password: string
}

interface OTPForm {
  code: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [pendingCredentials, setPendingCredentials] = useState<LoginForm | null>(null)
  const [isResending, setIsResending] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()
  const { register: registerOtp, handleSubmit: handleSubmitOtp, formState: { errors: otpErrors }, reset: resetOtpForm } = useForm<OTPForm>()

  const from = location.state?.from?.pathname || '/'

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsSubmitting(true)
      await apiService.requestOtp(data.username)
      setPendingCredentials(data)
      setStep('otp')
      resetOtpForm()
      toast.success('Verification code sent to your email')
    } catch (error) {
      console.error(error)
      toast.error('Failed to send verification code')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitOtp = async (data: OTPForm) => {
    if (!pendingCredentials) {
      toast.error('Please submit your email and password first')
      return
    }

    try {
      setIsSubmitting(true)
      await apiService.verifyOtp(pendingCredentials.username, data.code)
      await login(pendingCredentials.username, pendingCredentials.password)
      toast.success('Login successful!')
      navigate(from, { replace: true })
    } catch (error) {
      console.error(error)
      toast.error('Invalid or expired verification code')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    if (!pendingCredentials) {
      return
    }

    try {
      setIsResending(true)
      await apiService.requestOtp(pendingCredentials.username)
      toast.success('Verification code resent')
    } catch (error) {
      console.error(error)
      toast.error('Failed to resend verification code')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 'credentials' ? 'Sign in to your account' : 'Enter verification code'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'credentials'
              ? 'Access your resume customization tools'
              : `We have sent a verification code to ${pendingCredentials?.username}`}
          </p>
        </div>
        {step === 'credentials' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Email
                </label>
                <input
                  id="username"
                  type="email"
                  autoComplete="username"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  {...register('username', {
                    required: 'Email is required'
                  })}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending code...' : 'Send verification code'}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmitOtp(onSubmitOtp)}>
            <div>
              <label htmlFor="otp" className="sr-only">
                Verification code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm tracking-[0.75em]"
                placeholder="Enter 6-digit code"
                {...registerOtp('code', {
                  required: 'Verification code is required',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'Code must be 6 digits'
                  }
                })}
              />
              {otpErrors.code && (
                <p className="mt-1 text-sm text-red-600">{otpErrors.code.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending || isSubmitting}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Resending...' : 'Resend code'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('credentials')
                  setPendingCredentials(null)
                  setIsSubmitting(false)
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Change email
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Verifying...' : 'Verify & sign in'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginPage