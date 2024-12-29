import { Dashboard } from 'app/pages/Dashboard/Loadable';
import { AdminSetting } from 'app/pages/Setting/Loadable';
import { Translation } from 'app/pages/Translation/Loadable';
import { SeoHttp } from 'app/pages/404-301/Loadable';
import { Profile } from 'app/pages/Profile/Loadable';
import { SiteMap } from 'app/pages/SiteMap/Loadable';
import { Report } from 'app/pages/Report/Loadable';
import { Indexing } from 'app/pages/Indexing/Loadable';
import { Role } from 'app/pages/Role/Loadable';
import { User } from 'app/pages/User/Loadable';
import { UserDetail } from 'app/pages/UserDetail/Loadable';
import { RoleDetail } from 'app/pages/RoleDetail/Loadable';
import { AnalyticReport } from './pages/AnalyticReport/Loadable';
import { Catalog } from './pages/Catalog/Loadable';
import { Customers } from './pages/Customers/Loadable';
import { Discount } from './pages/Discount/Loadable';
import { Inventory } from './pages/Inventory/Loadable';
import { LiveView } from './pages/LiveView/Loadable';
import { Orders } from './pages/Orders/Loadable';
import { Overview } from './pages/Overview/Loadable';
import { Pricing } from './pages/Pricing/Loadable';

export const corepulseRoot = process.env.REACT_APP_SUB_DIR;

export const appRoutes: Array<{
  path: string;
  element: JSX.Element;
  type: 'others' | 'documents' | 'objects' | 'assets';
  key: string;
  action: string;
}> = [
  {
    path: `${corepulseRoot}/dashboard`,
    element: <Dashboard />,
    type: 'others',
    key: 'dashboard',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/setting`,
    element: <AdminSetting />,
    type: 'others',
    key: 'setting',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/translation`,
    element: <Translation />,
    type: 'others',
    key: 'translation',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/404-301`,
    element: <SeoHttp />,
    type: 'others',
    key: '404-301',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/profile`,
    element: <Profile />,
    type: 'others',
    key: 'profile',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/sitemap`,
    element: <SiteMap />,
    type: 'others',
    key: 'sitemap',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/indexing`,
    element: <Indexing />,
    type: 'others',
    key: 'indexing',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/report`,
    element: <Report />,
    type: 'others',
    key: 'report',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/role`,
    element: <Role />,
    type: 'others',
    key: 'role',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/role/detail`,
    element: <RoleDetail />,
    type: 'others',
    key: 'role',
    action: 'view',
  },
  {
    path: `${corepulseRoot}/user`,
    element: <User />,
    type: 'others',
    key: 'user',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/user/detail`,
    element: <UserDetail />,
    type: 'others',
    key: 'user',
    action: 'view',
  },
  {
    path: `${corepulseRoot}/overview`,
    element: <Overview />,
    type: 'others',
    key: 'overview',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/analyticReport`,
    element: <AnalyticReport />,
    type: 'others',
    key: 'analyticReport',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/liveView`,
    element: <LiveView />,
    type: 'others',
    key: 'liveView',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/emails`,
    element: <LiveView />,
    type: 'others',
    key: 'emails',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/orders`,
    element: <Orders />,
    type: 'others',
    key: 'orders',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/customers`,
    element: <Customers />,
    type: 'others',
    key: 'customers',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/pricing`,
    element: <Pricing />,
    type: 'others',
    key: 'pricing',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/discount`,
    element: <Discount />,
    type: 'others',
    key: 'discount',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/inventory`,
    element: <Inventory />,
    type: 'others',
    key: 'inventory',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/catalog`,
    element: <Catalog />,
    type: 'others',
    key: 'catalog',
    action: 'listing',
  },
  {
    path: `${corepulseRoot}/notification`,
    element: <Catalog />,
    type: 'others',
    key: 'notification',
    action: 'listing',
  },
];
