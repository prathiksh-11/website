import { Modal } from 'antd';
import {
  Activity,
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
  Tag,
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

interface NavSection {
  title: string;
  items: NavItem[];
}

const iconProps = { size: 18, strokeWidth: 1.75 };

const MENU_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        key: '/dashboard',
        label: 'Dashboard',
        permission: 'dashboard',
        icon: <LayoutDashboard {...iconProps} />,
      },
      {
        key: '/my-activity',
        label: 'Recently Active',
        permission: 'dashboard',
        icon: <Activity {...iconProps} />,
      },
      {
        key: '/reports',
        label: 'Reports',
        permission: 'reports',
        icon: <ClipboardList {...iconProps} />,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        key: '/customers',
        label: 'Customers',
        permission: 'customers',
        icon: <Users {...iconProps} />,
      },
      {
        key: '/trainers',
        label: 'Employees',
        permission: 'trainers',
        icon: <Dumbbell {...iconProps} />,
      },
      {
        key: '/branches',
        label: 'Branches',
        permission: 'branches',
        icon: <MapPin {...iconProps} />,
      },
    ],
  },
  {
    title: 'Services',
    items: [
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
    ],
  },
  {
    title: 'Finance',
    items: [
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
        key: '/offers',
        label: 'Offers',
        permission: 'offers',
        icon: <Tag {...iconProps} />,
      },
    ],
  },
  {
    title: 'System',
    items: [
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
    ],
  },
];

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useThemeStore((s) => s.collapsed);
  const { canAccess } = usePermissions();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const sections = useMemo(
    () =>
      MENU_SECTIONS.map((sec) => ({
        ...sec,
        items: sec.items.filter((item) => {
          if (item.key === '/my-activity') {
            return Boolean(user?.showActivityDashboard);
          }
          return canAccess(item.permission);
        }),
      })).filter((sec) => sec.items.length > 0),
    [canAccess, user?.showActivityDashboard],
  );

  const allItems = useMemo(
    () => MENU_SECTIONS.flatMap((sec) => sec.items),
    [],
  );

  const selectedKey =
    allItems.find((item) => location.pathname.startsWith(item.key))?.key ??
    '/dashboard';

  const confirmLogout = () => {
    Modal.confirm({
      title: 'Log out of studio admin?',
      content: 'Are you sure you want to sign out? You will need to log in again to access the dashboard.',
      okText: 'Logout',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      maskClosable: true,
      onOk: async () => {
        await logout();
        navigate('/login');
      },
    });
  };

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

      <nav className="admin-nav">
        {sections.map((sec) => (
          <div key={sec.title} className="admin-nav__group">
            <p className="admin-sider__section">{sec.title}</p>
            {sec.items.map((item) => {
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
          </div>
        ))}
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
          onClick={confirmLogout}
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
