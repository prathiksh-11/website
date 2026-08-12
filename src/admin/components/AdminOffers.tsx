import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Form,
  Input,
  Button,
  Upload,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Typography,
  message,
  Space,
  Switch,
  Divider,
  Image,
  Table,
  Tag,
  Popconfirm,
  Badge,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  TagOutlined,
  PictureOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  SortAscendingOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Sparkles, Image as ImageIcon, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { UploadFile } from 'antd/es/upload/interface';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

// Helper to safely compose API URLs without double or missing slashes
const getApiUrl = (endpoint: string) => {
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/').replace(/\/+$/, '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '').replace(/^api\//, '');
  return `${base}/${cleanEndpoint}`;
};

// Banner Template Configuration
const BANNER_TEMPLATES = {
  carousel: {
    label: 'Carousel Banner',
    ratio: '16:9',
    recommended: '1600x900',
    aspectRatio: 16 / 9,
    color: '#ff5000',
    bgColor: '#fff0e8',
  },
  promo_card: {
    label: 'Promotional Card',
    ratio: '2:1',
    recommended: '1200x600',
    aspectRatio: 2 / 1,
    color: '#16181f',
    bgColor: '#f1f3f7',
  },
};

interface BannerFormData {
  key?: string;
  title: string;
  banner_type: 'carousel' | 'promo_card';
  image?: UploadFile[];
  redirect_url?: string;
  display_order?: number;
  is_active?: boolean;
}

interface BannerItem extends BannerFormData {
  key: string;
  id?: number | string;
  image_url: string;
  imageUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export const AdminOffers = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedBannerType, setSelectedBannerType] = useState<'carousel' | 'promo_card'>('carousel');
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Search & Filters
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'carousel' | 'promo_card'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const getFullImageUrl = useCallback((relativePath: string) => {
    if (!relativePath) return '';
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath;
    }

    let baseUrl =
      import.meta.env.VITE_IMAGE_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000';

    baseUrl = baseUrl.replace(/\/+$/, '');
    const cleanPath = relativePath.replace(/^\/+/, '');
    return `${baseUrl}/${cleanPath}`;
  }, []);

  // Fetch banners on mount
  const fetchBanners = useCallback(async () => {
    setFetching(true);
    try {
      const apiUrl = getApiUrl('get-banners');
      const response = await axios.get(apiUrl, {
        headers: { Accept: 'application/json' },
      });

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const bannersWithKeys = response.data.data.map((banner: any) => {
          const fullImageUrl = getFullImageUrl(banner.image_url);
          return {
            ...banner,
            key: banner.id?.toString() || `banner-${banner.id}`,
            image: [],
            imageUrl: fullImageUrl,
          };
        });
        setBanners(bannersWithKeys);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Fetch banners error:', error);
      message.error('Failed to fetch banners');
    } finally {
      setFetching(false);
    }
  }, [getFullImageUrl]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleUploadChange = useCallback(
    ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
      setFileList(newFileList);
      if (newFileList.length > 0 && newFileList[0].originFileObj) {
        const url = URL.createObjectURL(newFileList[0].originFileObj);
        setPreviewImage(url);

        const img = new window.Image() as HTMLImageElement;
        img.onload = () => {
          const width = img.width;
          const height = img.height;

          if (selectedBannerType === 'carousel' && (width !== 1600 || height !== 900)) {
            message.warning(
              `Recommended size for Carousel is 1600x900px (Current: ${width}x${height}px)`
            );
          } else if (selectedBannerType === 'promo_card' && (width !== 1200 || height !== 600)) {
            message.warning(
              `Recommended size for Promo Card is 1200x600px (Current: ${width}x${height}px)`
            );
          }
          URL.revokeObjectURL(url);
        };
        img.src = url;
      } else if (newFileList.length === 0 && !editingBanner) {
        setPreviewImage('');
      }
    },
    [selectedBannerType, editingBanner]
  );

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj as Blob);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleBannerTypeChange = useCallback((value: 'carousel' | 'promo_card') => {
    setSelectedBannerType(value);
  }, []);

  const handleSubmit = async (values: BannerFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('banner_type', values.banner_type);
      formData.append('redirect_url', values.redirect_url || '');
      formData.append('display_order', values.display_order?.toString() || '1');
      formData.append('is_active', String(values.is_active ?? true));

      if (editingBanner) {
        formData.append('banner_id', editingBanner);
      }

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      const apiUrl = editingBanner ? getApiUrl('updateBanner') : getApiUrl('submitBanner');

      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        maxBodyLength: Infinity,
      });

      if (response.data && response.data.success) {
        message.success(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!');
        await fetchBanners();
        handleReset();
        setActiveTab('list');
      } else {
        message.error(response.data?.message || 'Operation failed');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      message.error(
        error.response?.data?.message || error.message || 'An error occurred while saving.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFileList([]);
    setPreviewImage('');
    setEditingBanner(null);
  };

  const handleEdit = (record: BannerItem) => {
    setEditingBanner(record.key);
    form.setFieldsValue({
      title: record.title,
      banner_type: record.banner_type,
      redirect_url: record.redirect_url,
      display_order: record.display_order,
      is_active: record.is_active,
    });
    setSelectedBannerType(record.banner_type);

    const imageUrl = getFullImageUrl(record.image_url);
    setPreviewImage(imageUrl);

    if (imageUrl) {
      setFileList([
        {
          uid: '-1',
          name: record.image_url.split('/').pop() || 'current-image.jpg',
          status: 'done',
          url: imageUrl,
        } as UploadFile,
      ]);
    }

    setActiveTab('add');
    message.info(`Editing banner "${record.title}"`);
  };

  const handleDelete = async (key: string) => {
    try {
      const apiUrl = getApiUrl(`deleteBanner/${key}`);
      const response = await axios.delete(apiUrl);

      if (response.data && response.data.success) {
        message.success('Banner deleted successfully!');
        await fetchBanners();
      } else {
        message.error(response.data?.message || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Failed to delete banner');
    }
  };

  const handleToggleActive = async (record: BannerItem, checked: boolean) => {
    try {
      const formData = new FormData();
      formData.append('banner_id', record.key);
      formData.append('title', record.title);
      formData.append('banner_type', record.banner_type);
      formData.append('redirect_url', record.redirect_url || '');
      formData.append('display_order', String(record.display_order || 1));
      formData.append('is_active', String(checked));

      const apiUrl = getApiUrl('updateBanner');
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.success) {
        message.success(`Banner status updated to ${checked ? 'Active' : 'Inactive'}`);
        setBanners((prev) =>
          prev.map((b) => (b.key === record.key ? { ...b, is_active: checked } : b))
        );
      } else {
        message.error('Failed to update status');
      }
    } catch {
      message.error('Error updating banner status');
    }
  };

  const handleCancelEdit = () => {
    handleReset();
    setActiveTab('list');
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const total = banners.length;
    const active = banners.filter((b) => b.is_active).length;
    const carousel = banners.filter((b) => b.banner_type === 'carousel').length;
    const promo = banners.filter((b) => b.banner_type === 'promo_card').length;
    return { total, active, carousel, promo };
  }, [banners]);

  // Filtered Banners
  const filteredBanners = useMemo(() => {
    return banners.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesType = typeFilter === 'all' || item.banner_type === typeFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && item.is_active) ||
        (statusFilter === 'inactive' && !item.is_active);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [banners, searchText, typeFilter, statusFilter]);

  const currentTemplate = BANNER_TEMPLATES[selectedBannerType];

  const columns: ColumnsType<BannerItem> = [
    {
      title: 'Preview',
      key: 'preview',
      width: 140,
      render: (_, record) => {
        const template = BANNER_TEMPLATES[record.banner_type] || BANNER_TEMPLATES.carousel;
        const imageUrl = getFullImageUrl(record.image_url);
        const hasError = imageErrors[record.key];

        return (
          <div
            style={{
              width: 110,
              aspectRatio: `${template.aspectRatio}`,
              borderRadius: 10,
              overflow: 'hidden',
              border: '1px solid rgba(22, 24, 31, 0.1)',
              backgroundColor: '#f7f8fb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {!hasError ? (
              <img
                src={imageUrl}
                alt={record.title}
                crossOrigin="anonymous"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setPreviewImage(imageUrl);
                  setPreviewOpen(true);
                }}
                onError={() => {
                  setImageErrors((prev) => ({ ...prev, [record.key]: true }));
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, padding: 6 }}>
                <ShieldAlert size={16} style={{ color: '#ef4444', margin: '0 auto 2px' }} />
                <span>Image error</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Banner Info',
      key: 'info',
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text strong style={{ color: '#16181f', fontSize: 15 }}>
            {record.title}
          </Text>
          {record.redirect_url ? (
            <a
              href={record.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#ff5000', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <LinkOutlined /> {record.redirect_url}
            </a>
          ) : (
            <Text type="secondary" style={{ fontSize: 12 }}>
              No redirect URL set
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Template',
      dataIndex: 'banner_type',
      key: 'banner_type',
      width: 170,
      render: (type) => {
        const template = BANNER_TEMPLATES[type as 'carousel' | 'promo_card'];
        if (!template) return null;
        return (
          <Tag
            style={{
              borderRadius: 8,
              padding: '4px 10px',
              fontWeight: 600,
              fontSize: 12,
              color: type === 'carousel' ? '#ff5000' : '#16181f',
              backgroundColor: type === 'carousel' ? '#fff0e8' : '#f1f3f7',
              borderColor: type === 'carousel' ? 'rgba(255, 80, 0, 0.2)' : 'rgba(22, 24, 31, 0.1)',
            }}
          >
            {template.label} ({template.ratio})
          </Tag>
        );
      },
    },
    {
      title: 'Order',
      dataIndex: 'display_order',
      key: 'display_order',
      width: 90,
      render: (order) => (
        <Badge
          count={`#${order || 1}`}
          style={{
            backgroundColor: '#16181f',
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: 8,
            padding: '0 8px',
          }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 120,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleActive(record, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Banner">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#ff5000', fontSize: 16 }} />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Banner"
            description="Are you sure you want to delete this promotional banner?"
            onConfirm={() => handleDelete(record.key)}
            okText="Delete"
            okType="danger"
            cancelText="Cancel"
          >
            <Tooltip title="Delete Banner">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined style={{ fontSize: 16 }} />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-offers-page" style={{ padding: '24px 28px', maxWidth: 1440, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Tag color="orange" style={{ borderRadius: 6, fontWeight: 700, padding: '2px 8px' }}>
              MARKETING
            </Tag>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Website Banner Management
            </Text>
          </div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#16181f', letterSpacing: '-0.02em' }}>
            Promotional Offers & Banners
          </Title>
        </div>

        <Space size="middle">
          <Button
            icon={<ReloadOutlined spin={fetching} />}
            onClick={fetchBanners}
            style={{ borderRadius: 10, height: 42, fontWeight: 600 }}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={activeTab === 'add' ? <UnorderedListOutlined /> : <PlusOutlined />}
            onClick={() => {
              if (activeTab === 'add') {
                handleCancelEdit();
              } else {
                handleReset();
                setActiveTab('add');
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #ff5000 0%, #e04800 100%)',
              border: 'none',
              borderRadius: 10,
              height: 42,
              padding: '0 20px',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(255, 80, 0, 0.35)',
            }}
          >
            {activeTab === 'add' ? 'View Banners List' : 'Create New Banner'}
          </Button>
        </Space>
      </div>

      {/* Summary Metrics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 16, border: '1px solid rgba(22, 24, 31, 0.08)', boxShadow: '0 4px 16px rgba(22, 24, 31, 0.03)' }} styles={{ body: { padding: 18 } }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Banners</Text>
                <Title level={3} style={{ margin: '4px 0 0', fontWeight: 800, color: '#16181f' }}>{metrics.total}</Title>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#f1f3f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={20} style={{ color: '#16181f' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 16, border: '1px solid rgba(22, 24, 31, 0.08)', boxShadow: '0 4px 16px rgba(22, 24, 31, 0.03)' }} styles={{ body: { padding: 18 } }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Banners</Text>
                <Title level={3} style={{ margin: '4px 0 0', fontWeight: 800, color: '#ff5000' }}>{metrics.active}</Title>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#fff0e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} style={{ color: '#ff5000' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 16, border: '1px solid rgba(22, 24, 31, 0.08)', boxShadow: '0 4px 16px rgba(22, 24, 31, 0.03)' }} styles={{ body: { padding: 18 } }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Carousels (16:9)</Text>
                <Title level={3} style={{ margin: '4px 0 0', fontWeight: 800, color: '#16181f' }}>{metrics.carousel}</Title>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#f1f3f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageIcon size={20} style={{ color: '#16181f' }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 16, border: '1px solid rgba(22, 24, 31, 0.08)', boxShadow: '0 4px 16px rgba(22, 24, 31, 0.03)' }} styles={{ body: { padding: 18 } }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Promo Cards (2:1)</Text>
                <Title level={3} style={{ margin: '4px 0 0', fontWeight: 800, color: '#16181f' }}>{metrics.promo}</Title>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#f1f3f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} style={{ color: '#ff5000' }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Card */}
      {activeTab === 'list' ? (
        <Card
          style={{
            background: '#ffffff',
            border: '1px solid rgba(22, 24, 31, 0.08)',
            borderRadius: 16,
            boxShadow: '0 10px 30px rgba(22, 24, 31, 0.04)',
          }}
          styles={{ body: { padding: 24 } }}
        >
          {/* Table Header Filter Toolbar */}
          <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 20 }}>
            <Col xs={24} md={10}>
              <Input
                placeholder="Search banners by title..."
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ borderRadius: 10, height: 40 }}
              />
            </Col>

            <Col xs={12} md={7}>
              <Select
                value={typeFilter}
                onChange={(val) => setTypeFilter(val)}
                style={{ width: '100%', height: 40 }}
                options={[
                  { value: 'all', label: 'All Template Types' },
                  { value: 'carousel', label: 'Carousel (16:9)' },
                  { value: 'promo_card', label: 'Promo Card (2:1)' },
                ]}
              />
            </Col>

            <Col xs={12} md={7}>
              <Select
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                style={{ width: '100%', height: 40 }}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'active', label: 'Active Only' },
                  { value: 'inactive', label: 'Inactive Only' },
                ]}
              />
            </Col>
          </Row>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={filteredBanners}
            loading={fetching}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            rowKey="key"
            style={{ color: '#16181f' }}
          />
        </Card>
      ) : (
        /* Form Card */
        <Card
          style={{
            background: '#ffffff',
            border: '1px solid rgba(22, 24, 31, 0.08)',
            borderRadius: 16,
            boxShadow: '0 10px 30px rgba(22, 24, 31, 0.04)',
          }}
          styles={{ body: { padding: 32 } }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              is_active: true,
              banner_type: 'carousel',
              display_order: 1,
            }}
          >
            <Row gutter={[36, 24]}>
              {/* Left Column - Form Fields */}
              <Col xs={24} lg={14}>
                <div>
                  <Title
                    level={4}
                    style={{
                      color: '#16181f',
                      marginBottom: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontWeight: 700,
                    }}
                  >
                    <TagOutlined style={{ color: '#ff5000' }} />
                    {editingBanner ? 'Edit Banner Details' : 'New Banner Configuration'}
                  </Title>
                  <Divider style={{ borderColor: 'rgba(22, 24, 31, 0.08)', marginTop: 0 }} />

                  <Form.Item
                    label={<span style={{ color: '#16181f', fontWeight: 600 }}>Banner Title</span>}
                    name="title"
                    rules={[{ required: true, message: 'Please enter banner title' }]}
                  >
                    <Input
                      size="large"
                      placeholder="e.g., Summer Special Membership Offer"
                      style={{
                        background: '#f7f8fb',
                        border: '1px solid rgba(22, 24, 31, 0.1)',
                        borderRadius: 10,
                      }}
                    />
                  </Form.Item>

                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span style={{ color: '#16181f', fontWeight: 600 }}>Banner Template</span>}
                        name="banner_type"
                        rules={[{ required: true, message: 'Please select banner type' }]}
                      >
                        <Select
                          size="large"
                          onChange={handleBannerTypeChange}
                          style={{ width: '100%', borderRadius: 10 }}
                          options={Object.entries(BANNER_TEMPLATES).map(([key, value]) => ({
                            value: key,
                            label: `${value.label} (${value.ratio})`,
                          }))}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span style={{ color: '#16181f', fontWeight: 600 }}>Redirect URL (Optional)</span>}
                        name="redirect_url"
                      >
                        <Input
                          size="large"
                          placeholder="e.g., /subscriptions or https://..."
                          prefix={<LinkOutlined style={{ color: '#94a3b8' }} />}
                          style={{
                            background: '#f7f8fb',
                            border: '1px solid rgba(22, 24, 31, 0.1)',
                            borderRadius: 10,
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span style={{ color: '#16181f', fontWeight: 600 }}>Display Order Priority</span>}
                        name="display_order"
                      >
                        <InputNumber
                          size="large"
                          style={{
                            width: '100%',
                            background: '#f7f8fb',
                            border: '1px solid rgba(22, 24, 31, 0.1)',
                            borderRadius: 10,
                          }}
                          min={1}
                          prefix={<SortAscendingOutlined style={{ color: '#94a3b8' }} />}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span style={{ color: '#16181f', fontWeight: 600 }}>Active Status</span>}
                        name="is_active"
                        valuePropName="checked"
                      >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <Divider style={{ borderColor: 'rgba(22, 24, 31, 0.08)' }} />

                <Form.Item>
                  <Space size="medium" style={{ width: '100%', justifyContent: 'flex-start' }}>
                    <Button
                      size="large"
                      onClick={handleCancelEdit}
                      style={{
                        borderRadius: 10,
                        padding: '0 28px',
                        height: 46,
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={loading}
                      style={{
                        background: 'linear-gradient(135deg, #ff5000 0%, #e04800 100%)',
                        border: 'none',
                        borderRadius: 10,
                        padding: '0 36px',
                        height: 46,
                        fontSize: 15,
                        fontWeight: 700,
                        boxShadow: '0 4px 16px rgba(255, 80, 0, 0.35)',
                      }}
                    >
                      {editingBanner ? 'Update Banner' : 'Publish Banner'}
                    </Button>
                  </Space>
                </Form.Item>
              </Col>

              {/* Right Column - Image Upload & Preview */}
              <Col xs={24} lg={10}>
                <div style={{ position: 'sticky', top: 20 }}>
                  <Title
                    level={4}
                    style={{
                      color: '#16181f',
                      marginBottom: 20,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontWeight: 700,
                    }}
                  >
                    <PictureOutlined style={{ color: '#ff5000' }} /> Image Specs & Preview
                  </Title>
                  <Divider style={{ borderColor: 'rgba(22, 24, 31, 0.08)', marginTop: 0 }} />

                  {/* Template Info Card */}
                  <Card
                    style={{
                      background: '#fff0e8',
                      border: '1px solid rgba(255, 80, 0, 0.2)',
                      borderRadius: 14,
                      marginBottom: 20,
                    }}
                    styles={{ body: { padding: 16 } }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text strong style={{ color: '#ff5000', fontSize: 15 }}>
                          {currentTemplate.label}
                        </Text>
                        <Tag color="orange" style={{ fontWeight: 700 }}>
                          {currentTemplate.ratio}
                        </Tag>
                      </div>
                      <Text style={{ fontSize: 13, color: '#16181f', fontWeight: 600 }}>
                        📐 Recommended Dimensions: {currentTemplate.recommended} px
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Upload high resolution WebP, PNG or JPG images matching the recommended aspect ratio for optimum quality.
                      </Text>
                    </Space>
                  </Card>

                  {/* Drag and Drop Upload */}
                  <Form.Item
                    name="image"
                    rules={[{ required: !editingBanner, message: 'Please upload an image' }]}
                  >
                    <Upload.Dragger
                      listType="picture"
                      fileList={fileList}
                      onChange={handleUploadChange}
                      onPreview={handlePreview}
                      beforeUpload={(file) => {
                        const isImage = file.type.startsWith('image/');
                        if (!isImage) {
                          message.error('You can only upload image files!');
                          return Upload.LIST_IGNORE;
                        }
                        const isLt5M = file.size / 1024 / 1024 < 5;
                        if (!isLt5M) {
                          message.error('Image must be smaller than 5MB!');
                          return Upload.LIST_IGNORE;
                        }
                        return true;
                      }}
                      maxCount={1}
                      accept="image/*"
                      style={{
                        borderRadius: 14,
                        border: '2px dashed rgba(255, 80, 0, 0.4)',
                        background: '#f7f8fb',
                        padding: '12px',
                      }}
                    >
                      <div style={{ padding: '24px 16px' }}>
                        <CloudUploadOutlined style={{ fontSize: 38, color: '#ff5000' }} />
                        <Paragraph style={{ marginTop: 12, marginBottom: 4, color: '#16181f' }}>
                          <Text strong>Click or drag image to upload</Text>
                        </Paragraph>
                        <Paragraph style={{ color: '#6f7685', fontSize: 12, margin: 0 }}>
                          Supports JPG, PNG, WEBP (Max 5MB)
                        </Paragraph>
                      </div>
                    </Upload.Dragger>
                  </Form.Item>

                  {/* Live Preview Card */}
                  {previewImage && (
                    <Card
                      style={{
                        marginTop: 20,
                        borderRadius: 14,
                        overflow: 'hidden',
                        border: '1px solid rgba(22, 24, 31, 0.1)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                      }}
                      styles={{ body: { padding: 0 } }}
                    >
                      <div
                        style={{
                          background: '#16181f',
                          padding: '10px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Space size="small">
                          <CheckCircleOutlined style={{ color: '#10b981' }} />
                          <Text style={{ color: '#ffffff', fontWeight: 600, fontSize: 13 }}>
                            Live Preview
                          </Text>
                        </Space>
                        <Tag color="orange" style={{ borderRadius: 6, margin: 0, fontWeight: 700 }}>
                          {currentTemplate.ratio}
                        </Tag>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: `${currentTemplate.aspectRatio}`,
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: '#f7f8fb',
                        }}
                      >
                        <img
                          src={previewImage}
                          alt="Banner Preview"
                          crossOrigin="anonymous"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={() => {
                            message.warning('Preview image cannot be displayed');
                          }}
                        />
                      </div>
                    </Card>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
      )}

      {/* Fullscreen Image Modal */}
      <Image
        style={{ display: 'none' }}
        src={previewImage}
        preview={{
          visible: previewOpen,
          onVisibleChange: (value) => setPreviewOpen(value),
        }}
      />
    </div>
  );
};

export default AdminOffers;