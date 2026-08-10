import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  Sparkles,
  Bell,
  Ticket,
  Users,
  Zap,
} from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';

interface NavItem {
  key: string;
  label: string;
  permission: string;
  icon: ReactNode;
}

const iconProps = { size: 18, strokeWidth: 1.75 };

const MENU_ITEMS: NavItem[] = [
  {
    key: '/dashboard',
    label: 'Dashboard',
    permission: 'dashboard',
    icon: <LayoutDashboard {...iconProps} />,
  },
  {
    key: '/customers',
    label: 'Customers',
    permission: 'customers',
    icon: <Users {...iconProps} />,
  },
  {
    key: '/trainers',
    label: 'Trainers',
    permission: 'trainers',
    icon: <Dumbbell {...iconProps} />,
  },
  {
    key: '/branches',
    label: 'Branches',
    permission: 'branches',
    icon: <MapPin {...iconProps} />,
  },
  {
    key: '/subscriptions',
    label: 'Subscriptions',
    permission: 'subscriptions',
    icon: <Sparkles {...iconProps} />,
  },
  {
    key: '/sessions',
    label: 'PT Sessions',
    permission: 'sessions',
    icon: <Zap {...iconProps} />,
  },
  {
    key: '/events',
    label: 'Events',
    permission: 'events',
    icon: <CalendarDays {...iconProps} />,
  },
  {
    key: '/reports',
    label: 'Reports',
    permission: 'reports',
    icon: <ClipboardList {...iconProps} />,
  },
  {
    key: '/transactions',
    label: 'Transactions',
    permission: 'transactions',
    icon: <CreditCard {...iconProps} />,
  },
  {
    key: '/coupons',
    label: 'Coupons',
    permission: 'coupons',
    icon: <Ticket {...iconProps} />,
  },
  {
    key: '/notifications',
    label: 'Notifications',
    permission: 'notifications',
    icon: <Bell {...iconProps} />,
  },
  {
    key: '/settings',
    label: 'Settings',
    permission: 'settings',
    icon: <Settings {...iconProps} />,
  },
];

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useThemeStore((s) => s.collapsed);
  const { canAccess } = usePermissions();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const items = useMemo(
    () => MENU_ITEMS.filter((item) => canAccess(item.permission)),
    [canAccess],
  );

  const selectedKey =
    MENU_ITEMS.find((item) => location.pathname.startsWith(item.key))?.key ??
    '/dashboard';

  return (
    <aside className={`admin-sider${collapsed ? ' is-collapsed' : ''}`}>
      <div className="admin-sider__glow" aria-hidden />

      <div className="admin-sider__brand">
        <img
          src="/logo.png"
          alt="Game On Fitness"
          className="admin-sider__logo"
        />
        <div className="admin-sider__title">
          Game On <em>Fitness</em>
          <small>Studio Admin</small>
        </div>
      </div>

      <p className="admin-sider__section">Overview</p>

      <nav className="admin-nav">
        {items.map((item) => {
          const active = selectedKey === item.key;
          return (
            <button
              key={item.key}
              type="button"
              className={`admin-nav__item${active ? ' is-active' : ''}`}
              onClick={() => navigate(item.key)}
              title={item.label}
            >
              <span className="admin-nav__icon">{item.icon}</span>
              <span className="admin-nav__label">{item.label}</span>
              {active ? <span className="admin-nav__dot" /> : null}
            </button>
          );
        })}
      </nav>

      <div className="admin-sider__footer">
        {!collapsed && user ? (
          <div className="admin-sider__user">
            <div className="admin-sider__avatar">{user.name.charAt(0)}</div>
            <div>
              <strong>{user.name.split(' ')[0]}</strong>
              <span>{user.role}</span>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          className="admin-nav__item admin-nav__item--logout"
          onClick={() => {
            void logout().then(() => navigate('/login'));
          }}
          title="Logout"
        >
          <span className="admin-nav__icon">
            <LogOut {...iconProps} />
          </span>
          <span className="admin-nav__label">Logout</span>
        </button>
      </div>
    </aside>
  );
};
