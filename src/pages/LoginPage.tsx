import { useEffect, useRef, useState } from 'react'
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
  const OTP_LENGTH = 6
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const otpInputsRef = useRef<HTMLInputElement[]>([])

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: {
      username: 'rusuland9@gmail.com',
      password: 'rusuland',
    },
  })
  const { register: registerOtp, handleSubmit: handleSubmitOtp, formState: { errors: otpErrors }, reset: resetOtpForm, setValue: setOtpFormValue } = useForm<OTPForm>()

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    setOtpFormValue('code', otpDigits.join(''), { shouldValidate: true })
  }, [otpDigits, setOtpFormValue])

  const focusOtpInput = (index: number) => {
    otpInputsRef.current[index]?.focus()
  }

  const handleOtpChange = (index: number, rawValue: string) => {
    const clean = rawValue.replace(/[^0-9]/g, '')
    const digit = clean.slice(-1)

    setOtpDigits((prev) => {
      const next = [...prev]
      next[index] = digit
      if (!digit) {
        next[index] = ''
      }
      return next
    })

    if (digit && index < OTP_LENGTH - 1) {
      setTimeout(() => focusOtpInput(index + 1), 0)
    }
  }

  const handleOtpBackspace = (index: number) => {
    setOtpDigits((prev) => {
      const next = [...prev]
      if (next[index]) {
        next[index] = ''
      } else if (index > 0) {
        next[index - 1] = ''
        setTimeout(() => focusOtpInput(index - 1), 0)
      }
      return next
    })
  }

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return

    setOtpDigits((prev) => {
      const next = [...prev]
      pasted.split('').forEach((char, idx) => {
        if (idx < OTP_LENGTH) {
          next[idx] = char
        }
      })
      return next
    })

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    setTimeout(() => focusOtpInput(nextIndex), 0)
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsSubmitting(true)
      // Verify credentials via signin first
      await apiService.login(data.username, data.password)

      setPendingCredentials(data)
      setStep('otp')
      setOtpDigits(Array(OTP_LENGTH).fill(''))
      resetOtpForm()
      setOtpFormValue('code', '')
      setTimeout(() => focusOtpInput(0), 0)
      toast.success('Verification code sent to your email')
    } catch (error) {
      console.error(error)
      const status = (error as any)?.response?.status
      if (status === 401) {
        toast.error('Invalid email or password')
      } else {
        toast.error('Failed to send verification code')
      }
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
      const response = await apiService.verifyOtp(pendingCredentials.username, data.code)
      const { token, user } = response.data
      login(token, user)
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
      await apiService.requestOtp(pendingCredentials.username, pendingCredentials.password)
      setOtpDigits(Array(OTP_LENGTH).fill(''))
      setOtpFormValue('code', '')
      setTimeout(() => focusOtpInput(0), 0)
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
              <div className="flex items-center justify-between gap-2">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onPaste={handleOtpPaste}
                    onKeyDown={(event) => {
                      if (event.key === 'Backspace') {
                        event.preventDefault()
                        handleOtpBackspace(index)
                      }
                    }}
                    ref={(element) => {
                      if (element) {
                        otpInputsRef.current[index] = element
                      }
                    }}
                  />
                ))}
              </div>
              <input
                id="otp-hidden"
                type="hidden"
                {...registerOtp('code', {
                  required: 'Verification code is required',
                  validate: (value) => /^[0-9]{6}$/.test(value.trim()) || 'Code must be 6 digits'
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
                  setOtpDigits(Array(OTP_LENGTH).fill(''))
                  setOtpFormValue('code', '')
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