import { Avatar, Card, Col, Form, Input, Row, Typography, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { AppButton, PageHeader } from '@/components/common';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';

export const Profile = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

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

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Your account details."
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
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card variant="borderless">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: user?.name,
                phone: user?.phone,
              }}
            >
              <Form.Item name="name" label="Full name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <Input disabled />
              </Form.Item>
              <AppButton type="primary" loading={saving} onClick={() => void onSave()}>
                Save profile
              </AppButton>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
