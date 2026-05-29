import { useState, useCallback, useEffect } from 'react';
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
  Tabs,
  Table,
  Tag,
  Popconfirm,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ShopOutlined,
  TagOutlined,
  PictureOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  SortAscendingOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Banner Template Configuration
const BANNER_TEMPLATES = {
  carousel: {
    label: 'Carousel Banner',
    ratio: '16:9',
    recommended: '1600x900',
    aspectRatio: 16 / 9,
    color: '#ff6b35',
  },
  promo_card: {
    label: 'Promotional Card',
    ratio: '2:1',
    recommended: '1200x600',
    aspectRatio: 2 / 1,
    color: '#ffb800',
  },
};

interface BannerFormData {
  key?: string;
  title: string;
  banner_type: 'carousel' | 'promo_card';
  image: UploadFile[];
  redirect_url: string;
  display_order: number;
  is_active: boolean;
}

interface BannerItem extends BannerFormData {
  key: string;
  image_url: string;
  imageUrl?: string;
  created_at?: string;
  updated_at?: string;
}

const AdminOffers = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedBannerType, setSelectedBannerType] = useState<'carousel' | 'promo_card'>('carousel');
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('add');
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleUploadChange = useCallback(({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const url = URL.createObjectURL(newFileList[0].originFileObj);
      setPreviewImage(url);
      
      // Validate image dimensions
      const img = new window.Image() as HTMLImageElement;
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const template = BANNER_TEMPLATES[selectedBannerType];
        
        console.log(`Image dimensions: ${width}x${height}`);
        console.log(`Recommended: ${template.recommended}`);
        
        // Check if dimensions match the recommended size
        if (selectedBannerType === 'carousel') {
          if (width !== 1600 || height !== 900) {
            message.warning(`Carousel banner should be 1600x900 pixels. Current: ${width}x${height}`);
          }
        } else if (selectedBannerType === 'promo_card') {
          if (width !== 1200 || height !== 600) {
            message.warning(`Promotional card should be 1200x600 pixels. Current: ${width}x${height}`);
          }
        }
        
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } else if (newFileList.length === 0) {
      setPreviewImage('');
    }
  }, [selectedBannerType]);

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

  const getFullImageUrl = useCallback((relativePath: string) => {
    if (!relativePath) return "";
    if (relativePath.startsWith('http')) return relativePath;
    
    let baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || 
                  import.meta.env.VITE_API_BASE_URL || 
                  'http://localhost:5000';
                
    baseUrl = baseUrl.replace(/\/+$/, '');
        const cleanPath = relativePath.replace(/^\/+/, '');
    const fullUrl = `${baseUrl}/${cleanPath}`;
    return fullUrl;
  }, []);

  // Fetch banners on mount
  const fetchBanners = useCallback(async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/get-banners`;
      console.log('Fetching banners from:', apiUrl);
      
      const response = await axios.get(apiUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('API Response:', JSON.stringify(response.data));
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const bannersWithKeys = response.data.data.map((banner: any) => {
          const fullImageUrl = getFullImageUrl(banner.image_url);
          
          return {
            ...banner,
            key: banner.id?.toString() || `banner-${banner.id}`,
            image: [],
            imageUrl: fullImageUrl, // Store the bound full path in the state
          };
        });
        setBanners(bannersWithKeys);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Fetch banners error:', error);
      message.error('Failed to fetch banners');
    }
  }, []);

  // Load banners on component mount
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleSubmit = async (values: BannerFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('banner_type', values.banner_type);
      formData.append('redirect_url', values.redirect_url || '');
      formData.append('display_order', values.display_order?.toString() || '1');
      formData.append('is_active', values.is_active.toString());

      // For editing, add banner_id
      if (editingBanner) {
        formData.append('banner_id', editingBanner);
      }

      // Only append image if a new file is selected
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
        console.log('New image selected:', fileList[0].originFileObj.name);
      } else if (editingBanner) {
        console.log('No new image selected for edit, keeping existing image');
      }

      // Use different endpoint for update vs create
      const apiUrl = editingBanner 
        ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/updateBanner`
        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/submitBanner`;
      
      console.log('Submitting to:', apiUrl);
      
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxBodyLength: Infinity,
      });

      console.log('Response:', JSON.stringify(response.data));

      if (response.data.success) {
        message.success(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!');
        
        // Refresh banners list from API
        await fetchBanners();

        // Reset form
        form.resetFields();
        setFileList([]);
        setPreviewImage('');
        setEditingBanner(null);
        setActiveTab('list');
      } else {
        message.error(response.data.message || 'Operation failed');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      message.error(error.response?.data?.message || error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFileList([]);
    setPreviewImage('');
    setEditingBanner(null);
    message.info('Form cleared');
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
    
    // Set preview from existing image URL
    const imageUrl = getFullImageUrl(record.image_url);
    console.log('Setting edit preview:', imageUrl);
    setPreviewImage(imageUrl);
    
    // Create a fake file list entry for display
    if (imageUrl) {
      setFileList([{
        uid: '-1',
        name: record.image_url.split('/').pop() || 'current-image.jpg',
        status: 'done',
        url: imageUrl,
      } as UploadFile]);
    }
    
    setActiveTab('add');
    message.info('Editing banner: ' + record.title);
  };

  const handleDelete = async (key: string) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/deleteBanner/${key}`;
      const response = await axios.delete(apiUrl);
      
      if (response.data.success) {
        message.success('Banner deleted successfully!');
        // Refresh banners list
        await fetchBanners();
      } else {
        message.error(response.data.message || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Failed to delete banner');
    }
  };

  const handleCancelEdit = () => {
    setEditingBanner(null);
    form.resetFields();
    setFileList([]);
    setPreviewImage('');
    setActiveTab('list');
    message.info('Edit cancelled');
  };

  const handleImageError = (bannerId: string) => {
    setImageErrors(prev => ({ ...prev, [bannerId]: true }));
  };

  const currentTemplate = BANNER_TEMPLATES[selectedBannerType];

  const columns: ColumnsType<BannerItem> = [
    {
      title: 'Preview',
      key: 'preview',
      width: 150,
      render: (_, record) => {
        const template = BANNER_TEMPLATES[record.banner_type];
        if (!template) return null;
        // Construct the full URL by binding the base API URL with the image path
        const imageUrl = getFullImageUrl(record.image_url);
        const hasError = imageErrors[record.key];
        
        return (
          <div
            style={{
              width: 120,
              aspectRatio: `${template.aspectRatio}`,
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!hasError ? (
              <img
                src={imageUrl}
                alt={record.title}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onLoad={() => {
                  console.log("Loaded:", imageUrl);
                  setImageErrors(prev => ({ ...prev, [record.key]: false }));
                }}
                onError={() => {
                  handleImageError(record.key);
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#999', fontSize: 12, padding: 10 }}>
                ⚠️ Image not found
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Text strong style={{ color: '#1a1a1a' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'banner_type',
      key: 'banner_type',
      render: (type) => {
        const template = BANNER_TEMPLATES[type as 'carousel' | 'promo_card'];
        if (!template) return null;
        return (
          <Tag color={template.color}>
            {template.label} ({template.ratio})
          </Tag>
        );
      },
    },
    {
      title: 'Redirect URL',
      dataIndex: 'redirect_url',
      key: 'redirect_url',
      render: (url) => (
        <Text style={{ color: '#888', fontSize: 12 }}>{url || '-'}</Text>
      ),
    },
    {
      title: 'Order',
      dataIndex: 'display_order',
      key: 'display_order',
      width: 80,
      render: (order) => (
        <Badge count={order} style={{ backgroundColor: '#ff6b35' }} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date) => (
        <Text style={{ color: '#888', fontSize: 12 }}>
          {date ? new Date(date).toLocaleDateString() : '-'}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#ff6b35' }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Banner"
            description="Are you sure you want to delete this banner?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f5f5f5 100%)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            padding: '32px 0',
          }}
        >
          <Title
            level={1}
            style={{
              color: '#1a1a1a',
              margin: 0,
              fontSize: 48,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ff6b35 0%, #ffb800 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <ShopOutlined /> Banner Management
          </Title>
        </div>

        {/* Tabs */}
        <Card
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            marginBottom: 32,
          }}
          styles={{ body: { padding: 0 } }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              if (key === 'add' && !editingBanner) {
                form.resetFields();
                setFileList([]);
                setPreviewImage('');
              }
            }}
            items={[
              {
                key: 'add',
                label: (
                  <span style={{ fontSize: 16, fontWeight: 500 }}>
                    <PlusOutlined /> {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                  </span>
                ),
                children: null,
              },
              {
                key: 'list',
                label: (
                  <span style={{ fontSize: 16, fontWeight: 500 }}>
                    <UnorderedListOutlined /> Banners List ({banners.length})
                  </span>
                ),
                children: null,
              },
            ]}
            style={{ padding: '0 24px' }}
          />
        </Card>

        {/* Form Card */}
        {activeTab === 'add' && (
        <Card
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          }}
          styles={{ body: { padding: 40 } }}
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
            <Row gutter={[32, 0]}>
              {/* Left Column - Form Fields */}
              <Col xs={24} lg={14}>
                <div style={{ marginBottom: 32 }}>
                  <Title
                    level={4}
                    style={{
                      color: '#ff6b35',
                      marginBottom: 24,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <TagOutlined /> Banner Details
                  </Title>
                  <Divider style={{ borderColor: 'rgba(0, 0, 0, 0.08)', marginTop: 0 }} />

                  <Form.Item
                    label={<span style={{ color: '#1a1a1a', fontWeight: 500 }}>Banner Title</span>}
                    name="title"
                    rules={[{ required: true, message: 'Please enter banner title' }]}
                  >
                    <Input
                      size="large"
                      placeholder="e.g., Summer Sale Banner"
                      style={{
                        background: '#fafafa',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        color: '#1a1a1a',
                        borderRadius: 8,
                      }}
                    />
                  </Form.Item>

                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span style={{ color: '#1a1a1a', fontWeight: 500 }}>Banner Template</span>}
                        name="banner_type"
                        rules={[{ required: true, message: 'Please select banner type' }]}
                      >
                        <Select
                          size="large"
                          onChange={handleBannerTypeChange}
                          style={{
                            background: '#fafafa',
                            borderRadius: 8,
                          }}
                          options={Object.entries(BANNER_TEMPLATES).map(([key, value]) => ({
                            value: key,
                            label: `${value.label} (${value.ratio})`,
                          }))}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span style={{ color: '#1a1a1a', fontWeight: 500 }}>Redirect URL</span>}
                        name="redirect_url"
                      >
                        <Input
                          size="large"
                          placeholder="e.g., /summer-sale"
                          prefix={<LinkOutlined />}
                          style={{
                            background: '#fafafa',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            color: '#1a1a1a',
                            borderRadius: 8,
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label={<span style={{ color: '#1a1a1a', fontWeight: 500 }}>Display Order</span>}
                        name="display_order"
                      >
                        <InputNumber
                          size="large"
                          style={{
                            width: '100%',
                            background: '#fafafa',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            color: '#1a1a1a',
                            borderRadius: 8,
                          }}
                          min={1}
                          prefix={<SortAscendingOutlined />}
                        />
                      </Form.Item>
                    </Col>

                 
                  </Row>
                </div>
                <Divider style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />

                <Form.Item>
                  <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
                    {editingBanner ? (
                      <Button
                        size="large"
                        icon={<DeleteOutlined />}
                        onClick={handleCancelEdit}
                        style={{
                          background: '#fafafa',
                          border: '1px solid rgba(0, 0, 0, 0.15)',
                          color: '#1a1a1a',
                          borderRadius: 8,
                          padding: '0 32px',
                          height: 48,
                        }}
                      >
                        Cancel Edit
                      </Button>
                    ) : (
                      <Button
                        size="large"
                        onClick={handleReset}
                        style={{
                          background: '#fafafa',
                          border: '1px solid rgba(0, 0, 0, 0.15)',
                          color: '#1a1a1a',
                          borderRadius: 8,
                          padding: '0 32px',
                          height: 48,
                        }}
                      >
                        Reset
                      </Button>
                    )}
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={loading}
                      style={{
                        background: 'linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%)',
                        border: 'none',
                        borderRadius: 8,
                        padding: '0 48px',
                        height: 48,
                        fontSize: 16,
                        fontWeight: 600,
                        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.4)',
                      }}
                    >
                      {editingBanner ? 'Update Banner' : 'Save Banner'}
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
                      color: '#ff6b35',
                      marginBottom: 24,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <PictureOutlined /> Image Upload & Preview
                  </Title>
                  <Divider style={{ borderColor: 'rgba(0, 0, 0, 0.08)', marginTop: 0 }} />

                  {/* Template Info */}
                  <Card
                    style={{
                      background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
                      border: `2px solid ${currentTemplate.color}`,
                      borderRadius: 12,
                      marginBottom: 24,
                    }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text strong style={{ color: currentTemplate.color, fontSize: 16 }}>
                        {currentTemplate.label}
                      </Text>
                      <Space direction="vertical" size="small">
                        <Tag color={currentTemplate.color}>
                          Aspect Ratio: {currentTemplate.ratio}
                        </Tag>
                        <Tag color="blue" style={{ fontSize: 13, fontWeight: 600 }}>
                          📐 Required Size: {currentTemplate.recommended}px (EXACT)
                        </Tag>
                      </Space>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Upload images with exact dimensions for best quality
                      </Text>
                    </Space>
                  </Card>

                  {/* Upload Area */}
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
                        
                        // Validate dimensions
                        return new Promise((resolve, reject) => {
                          const img = new window.Image() as HTMLImageElement;
                          img.onload = () => {
                            const width = img.width;
                            const height = img.height;
                            
                            if (selectedBannerType === 'carousel') {
                              if (width !== 1600 || height !== 900) {
                                message.error(`Carousel banner must be exactly 1600x900 pixels. Your image: ${width}x${height}`);
                                URL.revokeObjectURL(img.src);
                                reject();
                                return;
                              }
                            } else if (selectedBannerType === 'promo_card') {
                              if (width !== 1200 || height !== 600) {
                                message.error(`Promotional card must be exactly 1200x600 pixels. Your image: ${width}x${height}`);
                                URL.revokeObjectURL(img.src);
                                reject();
                                return;
                              }
                            }
                            
                            URL.revokeObjectURL(img.src);
                            resolve(true);
                          };
                          img.onerror = () => {
                            message.error('Failed to load image for validation');
                            reject();
                          };
                          img.src = URL.createObjectURL(file);
                        });
                      }}
                      maxCount={1}
                      accept="image/*"
                      style={{
                        borderRadius: 12,
                        border: `2px dashed ${currentTemplate.color}`,
                        background: '#fafafa',
                      }}
                    >
                      <div style={{ padding: '40px 20px' }}>
                        <CloudUploadOutlined style={{ fontSize: 48, color: currentTemplate.color }} />
                        <Paragraph style={{ marginTop: 16, color: '#666' }}>
                          <Text strong>Click or drag image to upload</Text>
                        </Paragraph>
                        <Paragraph style={{ color: '#999', fontSize: 12 }}>
                          Supports: JPG, PNG, WEBP. Max size: 5MB
                        </Paragraph>
                      </div>
                    </Upload.Dragger>
                  </Form.Item>

                  {/* Live Preview */}
                  {previewImage && (
                    <Card
                      style={{
                        marginTop: 24,
                        borderRadius: 12,
                        overflow: 'hidden',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                      }}
                      styles={{ body: { padding: 0 } }}
                    >
                      <div
                        style={{
                          background: '#f5f5f5',
                          padding: '16px',
                          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                        }}
                      >
                        <Space>
                          <CheckCircleOutlined style={{ color: '#10b981' }} />
                          <Text strong>Live Preview</Text>
                          <Tag color={currentTemplate.color}>{currentTemplate.ratio}</Tag>
                        </Space>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: `${currentTemplate.aspectRatio}`,
                          position: 'relative',
                          overflow: 'hidden',
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
                          onError={(e) => {
                            console.error('Preview image failed to load:', previewImage);
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

        {/* Banners List */}
        {activeTab === 'list' && (
        <Card
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          }}
          styles={{ body: { padding: 24 } }}
        >
          <Table
            columns={columns}
            dataSource={banners}
            pagination={{ pageSize: 10 }}
            style={{ color: '#1a1a1a' }}
            rowKey="key"
          />
        </Card>
        )}

        <Image
          styles={{ root: { display: 'none' } }}
          preview={{
            open: previewOpen,
            src: previewImage,
            onOpenChange: (value) => setPreviewOpen(value),
          }}
        />
      </div>
    </div>
  );
};

export default AdminOffers;