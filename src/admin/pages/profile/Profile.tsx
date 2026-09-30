import { Avatar, Card, Col, Form, Input, Row, Typography, message } from 'antd';
import { KeyOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { AppButton, PageHeader } from '@/components/common';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';

export const Profile = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const profile = await authApi.me();
        if (cancelled) return;
        setUser(profile);
        form.setFieldsValue({
          name: profile.name,
          phone: profile.phone,
        });
      } catch {
        /* keep persisted user */
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [form, setUser]);

  const onSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const next = await authApi.updateProfile({ name: values.name });
      setUser(next);
      message.success('Profile updated');
    } catch (error) {
      const text =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message?: string }).message)
          : 'Could not update profile';
      message.error(text);
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (values: { newPassword: string }) => {
    setChangingPassword(true);
    try {
      await authApi.changePassword(values.newPassword);
      message.success('Password updated successfully');
      passwordForm.resetFields();
    } catch (error) {
      const text =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message?: string }).message)
          : 'Could not update password';
      message.error(text);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Your account details and security settings."
        breadcrumbs={[{ title: 'Home', path: '/dashboard' }, { title: 'Profile' }]}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card variant="borderless" styles={{ body: { textAlign: 'center' } }}>
            <Avatar size={88} icon={<UserOutlined />} style={{ background: '#ff5000' }} />
            <Typography.Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
              {user?.name}
            </Typography.Title>
            <Typography.Text type="secondary">{user?.role}</Typography.Text>
            {user?.phone && (
              <div style={{ marginTop: 8 }}>
                <Typography.Text type="secondary" style={{ fontSize: '0.85rem' }}>
                  {user.phone}
                </Typography.Text>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card variant="borderless" title="Personal Details">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: user?.name,
                phone: user?.phone,
              }}
            >
              <Form.Item name="name" label="Full name" rules={[{ required: true, message: 'Full name required' }]}>
                <Input placeholder="Your full name" />
              </Form.Item>
              <Form.Item name="phone" label="Registered mobile">
                <Input disabled />
              </Form.Item>
              <AppButton type="primary" loading={saving} onClick={() => void onSave()}>
                Save profile
              </AppButton>
            </Form>
          </Card>

          <Card
            variant="borderless"
            title={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <KeyOutlined style={{ color: '#ff5000' }} />
                <span>Change Password</span>
              </span>
            }
            style={{ marginTop: 16 }}
          >
            <Typography.Paragraph type="secondary" style={{ marginTop: -4, marginBottom: 16 }}>
              Set a 4-digit PIN password for quick and secure account login.
            </Typography.Paragraph>

            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={onChangePassword}
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="newPassword"
                    label="New 4-digit password"
                    rules={[
                      { required: true, message: 'Enter a 4-digit password' },
                      {
                        pattern: /^\d{4}$/,
                        message: 'Password must be exactly 4 digits',
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="••••"
                      maxLength={4}
                      inputMode="numeric"
                      prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm 4-digit password"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Confirm your password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The two passwords do not match'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="••••"
                      maxLength={4}
                      inputMode="numeric"
                      prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <AppButton
                type="primary"
                htmlType="submit"
                loading={changingPassword}
              >
                Change password
              </AppButton>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
