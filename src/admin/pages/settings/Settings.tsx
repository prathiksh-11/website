import {
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Input, Select, Switch, message } from 'antd';
import {
  BellRing,
  Building2,
  Mail,
  Shield,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBranches } from '@/hooks/useBranches';
import { useAuthStore } from '@/store/auth.store';
import { useSettingsStore } from '@/store/settings.store';

const shortBranch = (name: string) =>
  name
    .replace(/^Game On Fitness\s*/i, '')
    .replace(/^(Premium Club|Luxury Club)\s*-?\s*/i, '')
    .trim() || name;

type SettingsTab = 'notifications' | 'workspace' | 'account';

const TABS: Array<{ key: SettingsTab; label: string; hint: string }> = [
  { key: 'notifications', label: 'Notifications', hint: 'Alerts & digests' },
  { key: 'workspace', label: 'Workspace', hint: 'Defaults for admin' },
  { key: 'account', label: 'Account', hint: 'Your signed-in user' },
];

export const Settings = () => {
  const [tab, setTab] = useState<SettingsTab>('notifications');
  const user = useAuthStore((s) => s.user);
  const {
    defaultBranchId,
    emailExpiryAlerts,
    dailySessionSummary,
    eventAlerts,
    supportEmail,
    setDefaultBranchId,
    setEmailExpiryAlerts,
    setDailySessionSummary,
    setEventAlerts,
    setSupportEmail,
  } = useSettingsStore();

  const { data: branchesData } = useBranches({ page: 1, pageSize: 200 });
  const [draftEmail, setDraftEmail] = useState(supportEmail);

  const active = TABS.find((t) => t.key === tab)!;

  const saveWorkspace = () => {
    setSupportEmail(draftEmail.trim() || supportEmail);
    message.success('Workspace preferences saved');
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
              <p>Control which reminders show in your workflow</p>
            </div>
          </div>

          <div className="set-row">
            <div>
              <strong>
                <BellOutlined /> Expiring subscriptions
              </strong>
              <p>Email-style alerts when memberships are ending soon</p>
            </div>
            <Switch
              checked={emailExpiryAlerts}
              onChange={setEmailExpiryAlerts}
            />
          </div>
          <div className="set-row">
            <div>
              <strong>
                <BellOutlined /> Daily session summary
              </strong>
              <p>Digest of PT sessions completed for the day</p>
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
              <p>Notify when new events are published to your branches</p>
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
              <p>Defaults used across lists and filters</p>
            </div>
          </div>

          <label className="set-field">
            <span>Default branch filter</span>
            <Select
              size="large"
              value={defaultBranchId}
              onChange={setDefaultBranchId}
              options={[
                { value: 'all', label: 'All branches' },
                ...(branchesData?.data.map((b) => ({
                  value: b.id,
                  label: shortBranch(b.name),
                })) ?? []),
              ]}
            />
          </label>

          <label className="set-field">
            <span>
              <Mail size={14} /> Support email
            </span>
            <Input
              size="large"
              value={draftEmail}
              onChange={(e) => setDraftEmail(e.target.value)}
              placeholder="support@club.com"
            />
          </label>

          <div className="set__actions">
            <Button type="primary" onClick={saveWorkspace}>
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
              <p>Signed-in identity for this admin session</p>
            </div>
          </div>

          <div className="set-account">
            <div className="set-account__avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt="" />
              ) : (
                <UserOutlined />
              )}
            </div>
            <div className="set-account__info">
              <h3>{user?.name ?? 'Admin user'}</h3>
              <p>{user?.role ?? '—'}</p>
              <dl>
                <div>
                  <dt>Mobile</dt>
                  <dd>{user?.phone || '—'}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{user?.email || '—'}</dd>
                </div>
                <div>
                  <dt>User ID</dt>
                  <dd>{user?.id || '—'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="set__actions">
            <Link to="/profile">
              <Button type="primary">Manage profile</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
