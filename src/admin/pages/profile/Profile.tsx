import { Avatar, Card, Col, Form, Input, Row, Typography, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AppButton, PageHeader } from '@/components/common';
import { useAuthStore } from '@/store/auth.store';

export const Profile = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [form] = Form.useForm();

  const onSave = async () => {
    const values = await form.validateFields();
    if (!user) return;
    const next = { ...user, ...values };
    setUser(next);
    localStorage.setItem('gym_admin_user', JSON.stringify(next));
    message.success('Profile updated');
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
                email: user?.email,
                phone: user?.phone,
              }}
            >
              <Form.Item name="name" label="Full name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input disabled />
              </Form.Item>
              <Form.Item name="phone" label="Phone">
                <Input />
              </Form.Item>
              <AppButton type="primary" onClick={() => void onSave()}>
                Save profile
              </AppButton>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
