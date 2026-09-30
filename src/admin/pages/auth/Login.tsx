import { ArrowLeftOutlined, LockOutlined, PhoneOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Segmented, Typography, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { requestFcmToken } from '@/lib/fcm';
import { getFirebaseAuth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { USE_MOCK } from '@/constants';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';

const loginSchema = z.object({
  mobile: z
    .string()
    .trim()
    .min(10, 'Enter a valid 10-digit mobile number')
    .regex(/^(\+91)?\d{10}$/, 'Enter a valid 10-digit mobile number'),
  password: z
    .string()
    .regex(/^\d{4}$/, 'Enter your 4-digit password'),
});

const mobileSchema = z
  .string()
  .trim()
  .regex(/^(\+91)?\d{10}$/, 'Enter a valid 10-digit mobile number');

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const loginWithOtp = useAuthStore((s) => s.loginWithOtp);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [error, setError] = useState<string | null>(null);

  // OTP specific state
  const [otpStep, setOtpStep] = useState<'phone' | 'verify'>('phone');
  const [otpMobile, setOtpMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const [phoneForm] = Form.useForm();

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    '/dashboard';

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {}
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const onPasswordFinish = async (values: { mobile: string; password: string }) => {
    setError(null);
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid form');
      return;
    }

    try {
      let fcmToken: string | undefined;
      try {
        fcmToken = (await requestFcmToken()) ?? undefined;
        console.log('[FCM] Login flow token:', fcmToken ?? '(none)');
      } catch (err) {
        console.warn('[FCM] Login flow token request failed:', err);
      }

      await login({ ...parsed.data, fcmToken });
      if (fcmToken) {
        console.log('[FCM] Token sent with login body as fcm_token');
      }
      message.success('Welcome back');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? 'Login failed';
      setError(msg);
    }
  };

  const handleSendOtp = async (values?: { mobile?: string }) => {
    setError(null);
    const targetMobile = values?.mobile ?? otpMobile;
    const parsed = mobileSchema.safeParse(targetMobile);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter a valid 10-digit mobile number');
      return;
    }

    const cleanMobile = targetMobile.replace(/\D/g, '').slice(-10);
    const formattedMobile = `+91${cleanMobile}`;
    setOtpMobile(cleanMobile);
    setSendingOtp(true);

    try {
      // Role validation: ONLY Super Admin and Admin can send OTP
      const check = await authApi.checkMobile(cleanMobile);
      if (!check.isRegistered) {
        setError(check.message || 'Mobile number not registered. Only Admin and Super Admin can login with OTP.');
        setSendingOtp(false);
        return;
      }

      if (!check.isSuperAdminOrAdmin) {
        setError('Access restricted. Only Super Admin and Admin can login with OTP.');
        setSendingOtp(false);
        return;
      }

      if (USE_MOCK) {
        await new Promise((res) => setTimeout(res, 600));
        setOtpStep('verify');
        setOtpCode('');
        setCountdown(30);
        message.success('OTP sent successfully (Demo code: 123456)');
        return;
      }

      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error('Firebase authentication is not configured. Please check your setup.');
      }

      // Reset previous verifier if any
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {}
        recaptchaVerifierRef.current = null;
      }

      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      recaptchaVerifierRef.current = verifier;

      const confirmation = await signInWithPhoneNumber(auth, formattedMobile, verifier);
      confirmationResultRef.current = confirmation;
      setOtpStep('verify');
      setOtpCode('');
      setCountdown(30);
      message.success(`OTP sent to ${formattedMobile}`);
    } catch (err: unknown) {
      console.error('[OTP] Send error:', err);
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {}
        recaptchaVerifierRef.current = null;
      }
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === 'auth/invalid-phone-number') {
        setError('Invalid mobile number format. Please check the 10-digit number.');
      } else if (firebaseError.code === 'auth/too-many-requests') {
        setError('Too many OTP attempts. Please wait a few minutes before trying again.');
      } else if (firebaseError.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized in Firebase Console for Phone Auth.');
      } else {
        setError(firebaseError.message ?? 'Failed to send OTP. Please try again.');
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit OTP code');
      return;
    }

    setVerifyingOtp(true);
    try {
      let idToken = 'mock_firebase_id_token';

      if (!USE_MOCK) {
        const confirmation = confirmationResultRef.current;
        if (!confirmation) {
          throw new Error('OTP session expired. Please request a new OTP.');
        }

        const credential = await confirmation.confirm(otpCode);
        idToken = await credential.user.getIdToken();
      }

      let fcmToken: string | undefined;
      try {
        fcmToken = (await requestFcmToken()) ?? undefined;
      } catch (err) {
        console.warn('[FCM] Token fetch error:', err);
      }

      await loginWithOtp({ idToken, fcmToken });
      message.success('Welcome back');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('[OTP] Verification error:', err);
      const firebaseError = err as { code?: string; message?: string };
      if (
        firebaseError.code === 'auth/invalid-verification-code' ||
        firebaseError.code === 'auth/code-expired'
      ) {
        setError('Invalid or expired OTP code. Please check or request a new code.');
      } else {
        const msg = (err as { message?: string })?.message ?? 'OTP verification failed';
        setError(msg);
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="admin-login">
      <section className="admin-login__brand">
        <div className="admin-login__mark">
          <img
            src="/logo.png"
            alt="Game On Fitness"
            className="admin-login__mark-badge"
          />
          <span>
            Game On <em>Fitness</em>
          </span>
        </div>

        <div className="admin-login__hero">
          <h1>
            Run your gym with <em>clarity</em> and energy.
          </h1>
          <p>
            Members, trainers, branches, and revenue — one calm control room built
            for Indian fitness businesses.
          </p>
        </div>

        <div className="admin-login__meta">
          <div>
            <strong>Super Admin</strong>
            Full access
          </div>
          <div>
            <strong>Admin</strong>
            Studio control
          </div>
          <div>
            <strong>Manager</strong>
            Branch ops
          </div>
        </div>
      </section>

      <section className="admin-login__panel">
        <div className="admin-login__card">
          <h2>Welcome back</h2>
          <p className="sub">
            Sign in to access your Game On Fitness management dashboard.
          </p>

          <Segmented
            block
            size="large"
            value={loginMode}
            onChange={(val) => {
              setLoginMode(val as 'password' | 'otp');
              setError(null);
            }}
            options={[
              {
                value: 'password',
                label: (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <LockOutlined />
                    <span>Password</span>
                  </span>
                ),
              },
              {
                value: 'otp',
                label: (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <SafetyCertificateOutlined />
                    <span>Login with OTP</span>
                  </span>
                ),
              },
            ]}
            style={{ marginBottom: 20 }}
          />

          {error ? (
            <Alert
              type="error"
              message={error}
              showIcon
              style={{ marginBottom: 16 }}
            />
          ) : null}

          {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
          <div id="recaptcha-container" />

          {loginMode === 'password' ? (
            <Form
              layout="vertical"
              onFinish={onPasswordFinish}
              requiredMark={false}
              size="large"
            >
              <Form.Item
                name="mobile"
                label="Mobile number"
                rules={[
                  { required: true, message: 'Mobile number required' },
                  {
                    pattern: /^(\+91)?\d{10}$/,
                    message: 'Enter a valid 10-digit mobile number',
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="10-digit mobile"
                  maxLength={13}
                  inputMode="numeric"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="4-digit password"
                rules={[
                  { required: true, message: 'Password required' },
                  {
                    pattern: /^\d{4}$/,
                    message: 'Enter your 4-digit password',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="••••"
                  maxLength={4}
                  inputMode="numeric"
                />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={isLoading}>
                Enter dashboard
              </Button>
            </Form>
          ) : (
            <div>
              {otpStep === 'phone' ? (
                <Form
                  form={phoneForm}
                  layout="vertical"
                  onFinish={handleSendOtp}
                  requiredMark={false}
                  size="large"
                  initialValues={{ mobile: otpMobile }}
                >
                  <Form.Item
                    name="mobile"
                    label="Mobile number"
                    extra="Only registered Super Admin and Admin mobile numbers are authorized to login via OTP."
                    rules={[
                      { required: true, message: 'Mobile number required' },
                      {
                        pattern: /^(\+91)?\d{10}$/,
                        message: 'Enter a valid 10-digit mobile number',
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      addonBefore="+91"
                      placeholder="10-digit mobile"
                      maxLength={10}
                      inputMode="numeric"
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={sendingOtp}
                    size="large"
                  >
                    Send OTP
                  </Button>
                </Form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--admin-soft)',
                      padding: '10px 14px',
                      borderRadius: 10,
                    }}
                  >
                    <div>
                      <Typography.Text type="secondary" style={{ fontSize: '0.8rem', display: 'block' }}>
                        OTP sent to
                      </Typography.Text>
                      <Typography.Text strong style={{ fontSize: '0.95rem' }}>
                        +91 {otpMobile}
                      </Typography.Text>
                    </div>
                    <Button
                      type="link"
                      size="small"
                      icon={<ArrowLeftOutlined />}
                      onClick={() => {
                        setOtpStep('phone');
                        setError(null);
                      }}
                    >
                      Change
                    </Button>
                  </div>

                  <div>
                    <Typography.Text
                      style={{
                        display: 'block',
                        marginBottom: 10,
                        fontWeight: 500,
                        fontSize: '0.9rem',
                      }}
                    >
                      Enter 6-digit OTP
                    </Typography.Text>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Input.OTP
                        length={6}
                        size="large"
                        value={otpCode}
                        onChange={(text) => setOtpCode(text)}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ color: 'var(--admin-muted)' }}>
                      Didn't receive code?
                    </span>
                    {countdown > 0 ? (
                      <Typography.Text type="secondary">
                        Resend in {countdown}s
                      </Typography.Text>
                    ) : (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => void handleSendOtp()}
                        loading={sendingOtp}
                        style={{ padding: 0 }}
                      >
                        Resend OTP
                      </Button>
                    )}
                  </div>

                  <Button
                    type="primary"
                    block
                    size="large"
                    onClick={() => void handleVerifyOtp()}
                    loading={verifyingOtp}
                    disabled={otpCode.length !== 6}
                  >
                    Verify OTP & Enter dashboard
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
