import { LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { requestFcmToken } from '@/lib/fcm';
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

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [error, setError] = useState<string | null>(null);

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    '/dashboard';

  const onFinish = async (values: { mobile: string; password: string }) => {
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
            Sign in with your registered mobile. Super Admin, Admin, and Manager
            only.
          </p>

          {error ? (
            <Alert
              type="error"
              message={error}
              showIcon
              style={{ marginBottom: 16 }}
            />
          ) : null}

          <Form
            layout="vertical"
            onFinish={onFinish}
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
        </div>
      </section>
    </div>
  );
};
