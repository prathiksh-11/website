import {
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Input, Select, Switch, Upload, message } from 'antd';
import axios from 'axios';
import {
  BellRing,
  Building2,
  Camera,
  Shield,
  Trash2,
  UploadCloud,
  UserRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { useBranches } from '@/hooks/useBranches';
import { useAuthStore } from '@/store/auth.store';
import { useSettingsStore } from '@/store/settings.store';

const shortBranch = (name: string) =>
  name
    .replace(/^Game On Fitness\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
    .trim() || name;

const errorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return String(error.response?.data?.message || error.message || fallback);
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: string }).message || fallback);
  }
  return fallback;
};

const splitName = (full?: string, lastName?: string) => {
  if (lastName) {
    const first = (full || '').trim();
    const lower = first.toLowerCase();
    const last = lastName.trim();
    const stripped = lower.endsWith(last.toLowerCase())
      ? first.slice(0, first.length - last.length).trim()
      : first;
    return { first: stripped || first, last };
  }
  const parts = (full || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first: '', last: '' };
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
};

type SettingsTab = 'notifications' | 'workspace' | 'account';

const TABS: Array<{ key: SettingsTab; label: string; hint: string }> = [
  { key: 'notifications', label: 'Notifications', hint: 'Push & digests' },
  { key: 'workspace', label: 'Workspace', hint: 'Defaults for admin' },
  { key: 'account', label: 'Account', hint: 'Your signed-in user' },
];

export const Settings = () => {
  const [tab, setTab] = useState<SettingsTab>('notifications');
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const {
    defaultBranchId,
    pushEnabled,
    emailExpiryAlerts,
    dailySessionSummary,
    eventAlerts,
    setDefaultBranchId,
    setPushEnabled,
    setEmailExpiryAlerts,
    setDailySessionSummary,
    setEventAlerts,
  } = useSettingsStore();

  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const [draftBranchId, setDraftBranchId] = useState(defaultBranchId);
  const [savingWorkspace, setSavingWorkspace] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.avatar);
  const [avatarFile, setAvatarFile] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);

  const pushBlocked =
    typeof Notification !== 'undefined' && Notification.permission === 'denied';

  const active = TABS.find((t) => t.key === tab)!;

  useEffect(() => {
    setDraftBranchId(defaultBranchId);
  }, [defaultBranchId]);

  useEffect(() => {
    if (tab !== 'account') return;
    let cancelled = false;

    const load = async () => {
      setLoadingProfile(true);
      try {
        const profile = await authApi.me();
        if (cancelled) return;
        setUser(profile);
        setAvatarPreview(profile.avatar);
        setAvatarFile(null);
        const names = splitName(profile.name, profile.lastName);
        setFirstName(names.first);
        setLastName(names.last);
      } catch {
        if (cancelled) return;
        setAvatarPreview(user?.avatar);
        setAvatarFile(null);
        const names = splitName(user?.name, user?.lastName);
        setFirstName(names.first);
        setLastName(names.last);
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [tab, setUser, user?.avatar, user?.lastName, user?.name]);

  const saveWorkspace = () => {
    setSavingWorkspace(true);
    setDefaultBranchId(draftBranchId);
    try {
      if (draftBranchId && draftBranchId !== 'all') {
        sessionStorage.setItem('dashboard-branch-id', draftBranchId);
      } else {
        sessionStorage.removeItem('dashboard-branch-id');
      }
    } catch {
      /* ignore */
    }
    setSavingWorkspace(false);
    message.success('Default branch will apply on dashboard and lists');
  };

  const handleAvatarChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('Please select an image file (PNG, JPG, WEBP)');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image size must be less than 5MB');
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setAvatarFile(base64);
      setAvatarPreview(base64);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemoveAvatar = () => {
    setAvatarFile('');
    setAvatarPreview(undefined);
  };

  const saveAccount = async () => {
    if (!firstName.trim()) {
      message.error('Enter your first name');
      return;
    }
    if (password && !/^\d{4}$/.test(password)) {
      message.error('Password must be 4 digits');
      return;
    }

    setSavingAccount(true);
    try {
      const next = await authApi.updateProfile({
        name: firstName.trim(),
        lastName: lastName.trim(),
        password: password || undefined,
        image: avatarFile !== null ? avatarFile : undefined,
      });
      setUser(next);
      setAvatarPreview(next.avatar);
      setAvatarFile(null);
      setPassword('');
      message.success('Account updated successfully');
    } catch (error) {
      message.error(errorMessage(error, 'Could not update account'));
    } finally {
      setSavingAccount(false);
    }
  };

  return (
    <div className="set">
      <header className="set__hero">
        <div>
          <p className="set__kicker">Preferences</p>
          <h1>Settings</h1>
          <p className="set__sub">{active.hint}</p>
        </div>
        <div className="set__hero-meta">
          <Shield size={18} />
          <div>
            <strong>{user?.role ?? 'Admin'}</strong>
            <span>access level</span>
          </div>
        </div>
      </header>

      <nav className="set__tabs" aria-label="Settings sections">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={tab === item.key ? 'set__tab set__tab--on' : 'set__tab'}
            onClick={() => setTab(item.key)}
          >
            <strong>{item.label}</strong>
            <span>{item.hint}</span>
          </button>
        ))}
      </nav>

      {tab === 'notifications' && (
        <section className="set__panel">
          <div className="set__panel-head">
            <BellRing size={18} />
            <div>
              <h2>Notifications</h2>
              <p>These apply to this browser session and push alerts</p>
            </div>
          </div>

          <div className="set-row">
            <div>
              <strong>
                <BellOutlined /> Browser push
              </strong>
              <p>
                {pushBlocked
                  ? 'Blocked in this browser — allow notifications in site settings'
                  : 'Register this device for live admin alerts'}
              </p>
            </div>
            <Switch
              checked={pushEnabled}
              disabled={pushBlocked}
              onChange={setPushEnabled}
            />
          </div>
          <div className="set-row">
            <div>
              <strong>
                <BellOutlined /> Expiring subscriptions
              </strong>
              <p>Show alerts when memberships are ending soon</p>
            </div>
            <Switch
              checked={emailExpiryAlerts}
              onChange={setEmailExpiryAlerts}
            />
          </div>
          <div className="set-row">
            <div>
              <strong>
                <BellOutlined /> Session alerts
              </strong>
              <p>PT session reminders and session-end notices</p>
            </div>
            <Switch
              checked={dailySessionSummary}
              onChange={setDailySessionSummary}
            />
          </div>
          <div className="set-row">
            <div>
              <strong>
                <BellOutlined /> Special event alerts
              </strong>
              <p>Notify when new events are published</p>
            </div>
            <Switch checked={eventAlerts} onChange={setEventAlerts} />
          </div>
        </section>
      )}

      {tab === 'workspace' && (
        <section className="set__panel">
          <div className="set__panel-head">
            <Building2 size={18} />
            <div>
              <h2>Workspace</h2>
              <p>Default branch used on dashboard and list filters</p>
            </div>
          </div>

          <label className="set-field">
            <span>Default branch filter</span>
            <Select
              size="large"
              value={draftBranchId}
              onChange={setDraftBranchId}
              options={[
                { value: 'all', label: 'All branches' },
                ...(branchesData?.data.map((b) => ({
                  value: b.id,
                  label: shortBranch(b.name),
                })) ?? []),
              ]}
            />
          </label>

          <div className="set__actions">
            <Button
              type="primary"
              loading={savingWorkspace}
              onClick={saveWorkspace}
            >
              Save workspace
            </Button>
          </div>
        </section>
      )}

      {tab === 'account' && (
        <section className="set__panel">
          <div className="set__panel-head">
            <UserRound size={18} />
            <div>
              <h2>Account</h2>
              <p>Loaded from your gym-backend profile</p>
            </div>
          </div>

          <div className="set-account">
            <div className="set-account__avatar-wrap" style={{ position: 'relative' }}>
              <div className="set-account__avatar" style={{ width: 80, height: 80, borderRadius: 20 }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserOutlined style={{ fontSize: '1.75rem' }} />
                )}
              </div>
              <Upload
                showUploadList={false}
                beforeUpload={handleAvatarChange}
                accept="image/png,image/jpeg,image/jpg,image/webp"
              >
                <button
                  type="button"
                  title="Upload profile photo"
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--admin-primary, #ff5000)',
                    color: '#ffffff',
                    border: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  }}
                >
                  <Camera size={14} />
                </button>
              </Upload>
            </div>

            <div className="set-account__info" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3>{user?.name ?? 'Admin user'}</h3>
                  <p>{user?.role ?? '—'}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <Upload
                    showUploadList={false}
                    beforeUpload={handleAvatarChange}
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                  >
                    <Button size="small" icon={<UploadCloud size={14} />}>
                      Change photo
                    </Button>
                  </Upload>
                  {avatarPreview ? (
                    <Button
                      size="small"
                      danger
                      icon={<Trash2 size={14} />}
                      onClick={handleRemoveAvatar}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              </div>
              <dl style={{ marginTop: '0.65rem' }}>
                <div>
                  <dt>Mobile</dt>
                  <dd>{user?.phone || '—'}</dd>
                </div>

              </dl>
            </div>
          </div>

          <label className="set-field">
            <span>First name</span>
            <Input
              size="large"
              value={firstName}
              disabled={loadingProfile}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="set-field">
            <span>Last name</span>
            <Input
              size="large"
              value={lastName}
              disabled={loadingProfile}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label className="set-field">
            <span>New 4-digit password</span>
            <Input.Password
              size="large"
              maxLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
              placeholder="Leave blank to keep current"
            />
          </label>

          <div className="set__actions">
            <Button
              type="primary"
              loading={savingAccount}
              onClick={() => void saveAccount()}
            >
              Save account
            </Button>
            <Link to="/profile">
              <Button>Open profile</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
