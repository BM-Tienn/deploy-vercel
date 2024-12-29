import { useEffect, useState, useCallback } from 'react';
import { LayoutWrapper } from './styled';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Menu, MenuProps, Flex } from 'antd';
import { Logout } from './components/Logout';
import { getSidebarApi } from 'services/layoutApi';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { Search } from '../Search';
import { globalActions } from 'app/slice';
import { useDispatch, useSelector } from 'react-redux';
import { Classes } from 'app/slice/types';
import {
  Search01Icon,
  Notification02Icon,
  Home01Icon,
  UserCircleIcon,
  Settings01Icon,
} from 'hugeicons-react';
import { usePermissionsSlice } from 'app/components/Permission/slice';
import { getAllPermission } from 'services/settingApi';
import { hasPermission } from 'app/functions/hasPermission';
import { globalPermissionData, globalIsAdmin } from 'app/slice/selector';
import { corepulseRoot } from 'app/routesConfig';

export interface LayoutProps {}
type MenuItem = Required<MenuProps>['items'][number];

export function Layout(props: LayoutProps) {
  const { actions } = usePermissionsSlice();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { object } = useParams();
  const [objList, setObjList] = useState<Classes[]>([]);
  const permissionData = useSelector(globalPermissionData);
  const isAdmin = useSelector(globalIsAdmin);

  const [isSeachOpen, setIsSeachOpen] = useState(false);
  const handleSelect = useCallback(
    (change: { key: string }) => {
      if (change.key === 'search') {
        setIsSeachOpen(true);
      } else {
        navigate(`${process.env.REACT_APP_SUB_DIR}/${change.key}`);
      }
    },
    [navigate],
  );

  useEffect(() => {
    const getPermission = async () => {
      try {
        const { data } = await getAllPermission();
        if (data?.data) {
          dispatch(globalActions.initIsAdmin(data?.data?.defaultAdmin));
          if (data?.data?.permissions) {
            dispatch(globalActions.updatePermission(data?.data?.permissions));
          }
        }
      } catch ({ response }: any) {}
    };
    const fetchData = async () => {
      try {
        const { data } = await getSidebarApi();
        if (data) {
          setObjList(data?.data?.data);
          dispatch(actions.initObjectsConfig(data?.data));
        }
      } catch ({ response }: any) {
        getMessage(response?.data);
      }
    };
    getPermission();
    fetchData();
  }, [actions, dispatch]);

  const [objectItem, setObjectItem] = useState<any[]>([]);

  useEffect(() => {
    if (objList) {
      const items = objList
        ?.filter(obj => {
          if (isAdmin) return obj;

          const checkPermission = hasPermission(
            permissionData || {
              assets: [],
              documents: [],
              objects: [],
              others: [],
            },
            'objects',
            obj.id,
            'listing',
          );

          return checkPermission ? obj : false;
        })
        .map(obj => {
          return {
            key: obj.id,
            label: obj.title || obj.name,
            className: 'custom-menuItem',
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M11.9815 1.81832L13.6482 2.69332C15.4407 3.63416 16.3373 4.10416 16.8357 4.94999C17.3332 5.79499 17.3332 6.84749 17.3332 8.95166V9.04916C17.3332 11.1525 17.3332 12.205 16.8357 13.05C16.3373 13.8958 15.4407 14.3667 13.6482 15.3075L11.9815 16.1817C10.5182 16.9492 9.7865 17.3333 8.99984 17.3333C8.21317 17.3333 7.4815 16.95 6.01817 16.1817L4.3515 15.3067C2.559 14.3658 1.66234 13.8958 1.164 13.05C0.666504 12.205 0.666504 11.1525 0.666504 9.04999V8.95249C0.666504 6.84832 0.666504 5.79582 1.164 4.95082C1.66234 4.10499 2.559 3.63416 4.3515 2.69416L6.01817 1.81916C7.4815 1.05082 8.21317 0.666656 8.99984 0.666656C9.7865 0.666656 10.5182 1.04999 11.9815 1.81832Z"
                  stroke="#333333"
                  className="stroke"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  opacity="0.5"
                  d="M16.5 5.25L9 9M9 9L1.5 5.25M9 9V16.9167"
                  stroke="#333333"
                  className="stroke"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            ),
          };
        });
      setObjectItem(items);
      dispatch(globalActions.updateClasses(objList));
    }
  }, [dispatch, isAdmin, objList, permissionData]);

  const items: MenuItem[] = [
    {
      className: 'custom-menuGroup',
      type: 'group',
      children: [
        {
          key: 'search',
          label: 'Search',
          icon: <Search01Icon size={18} strokeWidth={1.5} />,
        },
        {
          key: 'notification',
          label: 'Notification',

          icon: <Notification02Icon size={18} strokeWidth={1.5} />,
        },
        {
          key: 'dashboard',
          label: 'Dashboard',
          icon: <Home01Icon size={18} strokeWidth={1.5} />,
        },
      ],
    },
    {
      className: 'custom-menuGroup content',
      type: 'group',
      label: (
        <span className="px-3 uppercase font-semibold text-sm">content</span>
      ),
      children: [
        {
          key: 'pages',
          label: 'Pages',
          className: 'custom-menuItem',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                opacity="0.5"
                d="M1.5 7.33332C1.5 4.19082 1.5 2.61916 2.47667 1.64332C3.4525 0.666656 5.02417 0.666656 8.16667 0.666656H9.83333C12.9758 0.666656 14.5475 0.666656 15.5233 1.64332C16.5 2.61916 16.5 4.19082 16.5 7.33332V10.6667C16.5 13.8092 16.5 15.3808 15.5233 16.3567C14.5475 17.3333 12.9758 17.3333 9.83333 17.3333H8.16667C5.02417 17.3333 3.4525 17.3333 2.47667 16.3567C1.5 15.3808 1.5 13.8092 1.5 10.6667V7.33332Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                d="M5.6665 7.33331H12.3332M5.6665 10.6666H9.83317"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
        {
          key: 'emails',
          label: 'Emails',
          className: 'custom-menuItem',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="16"
              viewBox="0 0 18 16"
              fill="none"
            >
              <path
                opacity="0.5"
                d="M0.666504 7.99999C0.666504 4.85749 0.666504 3.28583 1.64317 2.30999C2.619 1.33333 4.19067 1.33333 7.33317 1.33333H10.6665C13.809 1.33333 15.3807 1.33333 16.3565 2.30999C17.3332 3.28583 17.3332 4.85749 17.3332 7.99999C17.3332 11.1425 17.3332 12.7142 16.3565 13.69C15.3807 14.6667 13.809 14.6667 10.6665 14.6667H7.33317C4.19067 14.6667 2.619 14.6667 1.64317 13.69C0.666504 12.7142 0.666504 11.1425 0.666504 7.99999Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                d="M4 4.66666L5.79917 6.16666C7.33 7.44166 8.095 8.07916 9 8.07916C9.905 8.07916 10.6708 7.44166 12.2008 6.16582L14 4.66666"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
        {
          key: 'media-library',
          label: 'Media Library',
          className: 'custom-menuItem',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M0.666504 10.1983C0.666504 7.055 0.666504 5.48334 1.64317 4.5075C2.619 3.53167 4.19067 3.53167 7.33317 3.53167H10.6665C13.809 3.53167 15.3807 3.53167 16.3565 4.5075C17.3332 5.48417 17.3332 7.055 17.3332 10.1983C17.3332 13.34 17.3332 14.9117 16.3565 15.8883C15.3807 16.865 13.809 16.865 10.6665 16.865H7.33317C4.19067 16.865 2.619 16.865 1.64317 15.8883C0.666504 14.9117 0.666504 13.3408 0.666504 10.1983Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                opacity="0.5"
                d="M2.32324 4C2.41658 3.22417 2.61241 2.68833 3.02074 2.28083C3.80408 1.5 5.06574 1.5 7.58908 1.5H10.2649C12.7882 1.5 14.0491 1.5 14.8332 2.28083C15.2416 2.68833 15.4374 3.22417 15.5307 4"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                opacity="0.5"
                d="M13.583 8.53167C14.2734 8.53167 14.833 7.97203 14.833 7.28167C14.833 6.59131 14.2734 6.03167 13.583 6.03167C12.8927 6.03167 12.333 6.59131 12.333 7.28167C12.333 7.97203 12.8927 8.53167 13.583 8.53167Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                opacity="0.5"
                d="M0.666504 10.615L2.1265 9.3375C2.49245 9.01756 2.96629 8.84861 3.45211 8.86486C3.93792 8.8811 4.39941 9.08133 4.74317 9.425L8.31817 13C8.5957 13.2772 8.96212 13.4477 9.35295 13.4814C9.74378 13.5151 10.134 13.4098 10.4548 13.1842L10.704 13.0092C11.1671 12.6841 11.7267 12.5257 12.2915 12.5599C12.8563 12.5941 13.3927 12.8189 13.8132 13.1975L16.4998 15.6142"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
        {
          key: 'translation',
          label: 'Translation',
          className: 'custom-menuItem',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="18"
              viewBox="0 0 17 18"
              fill="none"
            >
              <path
                opacity="0.5"
                d="M8 17.3333V15.6667"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M1.3335 12.8017C2.13873 13.7041 3.12579 14.4259 4.22983 14.9197C5.33387 15.4134 6.5299 15.668 7.73933 15.6667C12.486 15.6667 16.3335 11.8192 16.3335 7.0725C16.3335 4.5275 15.2268 2.24 13.4685 0.666664"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                opacity="0.5"
                d="M3.83366 2.79417C4.32116 3.25417 5.32533 4.51333 5.44283 5.86417C5.55199 7.12667 6.35616 8.1525 7.58366 8.16667C8.05533 8.17167 8.53283 7.81833 8.53116 7.32917C8.53116 7.1775 8.50616 7.02333 8.46949 6.88083C8.40721 6.66229 8.42555 6.42865 8.52116 6.2225C8.90199 5.4075 9.65199 5.18833 10.2462 4.74583C10.5095 4.54917 10.7495 4.3425 10.8562 4.17583C11.1478 3.715 11.4412 2.79417 11.2945 2.33333M9.07616 13.1667C8.89283 12.8217 8.63699 11.925 9.07616 11.0975C9.62533 10.0633 11.4545 10.0633 11.4545 10.0633C12.8645 10.0483 13.3728 9.41167 13.6112 8.845M13.8337 7.33333C13.8337 8.09938 13.6828 8.85792 13.3896 9.56565C13.0965 10.2734 12.6668 10.9164 12.1251 11.4581C11.5834 11.9998 10.9404 12.4295 10.2326 12.7226C9.52491 13.0158 8.76637 13.1667 8.00033 13.1667C7.23428 13.1667 6.47574 13.0158 5.76801 12.7226C5.06027 12.4295 4.41721 11.9998 3.87554 11.4581C3.33386 10.9164 2.90418 10.2734 2.61103 9.56565C2.31788 8.85792 2.16699 8.09938 2.16699 7.33333C2.16699 5.78624 2.78157 4.30251 3.87554 3.20854C4.9695 2.11458 6.45323 1.5 8.00033 1.5C9.54742 1.5 11.0312 2.11458 12.1251 3.20854C13.2191 4.30251 13.8337 5.78624 13.8337 7.33333Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                d="M6.3335 17.3333H9.66683"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
      ],
    },
    {
      className: 'custom-menuGroup',
      type: 'group',
      label: (
        <span className="px-3 uppercase font-semibold text-sm">COMMERCE</span>
      ),

      children: [
        {
          key: 'catalog',
          label: 'Catalog',
          className: 'custom-menuItem',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M11.9815 1.81833L13.6482 2.69333C15.4407 3.63417 16.3373 4.10417 16.8357 4.95C17.3332 5.795 17.3332 6.8475 17.3332 8.95167V9.04917C17.3332 11.1525 17.3332 12.205 16.8357 13.05C16.3373 13.8958 15.4407 14.3667 13.6482 15.3075L11.9815 16.1817C10.5182 16.9492 9.7865 17.3333 8.99984 17.3333C8.21317 17.3333 7.4815 16.95 6.01817 16.1817L4.3515 15.3067C2.559 14.3658 1.66234 13.8958 1.164 13.05C0.666504 12.205 0.666504 11.1525 0.666504 9.05V8.9525C0.666504 6.84833 0.666504 5.79583 1.164 4.95083C1.66234 4.105 2.559 3.63417 4.3515 2.69417L6.01817 1.81917C7.4815 1.05083 8.21317 0.666667 8.99984 0.666667C9.7865 0.666667 10.5182 1.05 11.9815 1.81833Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                opacity="0.5"
                d="M16.5 5.25L13.1667 6.91667M13.1667 6.91667L12.75 7.125L9 9M13.1667 6.91667V9.83333M13.1667 6.91667L5.25 2.75M9 9L1.5 5.25M9 9V16.9167"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
        {
          key: 'inventory',
          label: 'Inventory',
          className: 'custom-menuItem',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M17.3332 17.3333H0.666504M1.49984 17.3333V8.45583C1.49987 8.10282 1.57467 7.75381 1.71931 7.43179C1.86395 7.10976 2.07515 6.82202 2.339 6.5875L7.339 2.14333C7.79662 1.7366 8.38759 1.51192 8.99984 1.51192C9.61209 1.51192 10.2031 1.7366 10.6607 2.14333L15.6607 6.5875C15.9245 6.82202 16.1357 7.10976 16.2804 7.43179C16.425 7.75381 16.4998 8.10282 16.4998 8.45583V17.3333M7.33317 6.5H10.6665"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                opacity="0.5"
                d="M6.5 11.9167H11.5M6.5 14.4167H11.5"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                opacity="0.5"
                d="M14 17.3333V12.3333C14 10.7617 14 9.97667 13.5117 9.48833C13.0233 9 12.2383 9 10.6667 9H7.33333C5.76167 9 4.97667 9 4.48833 9.48833C4 9.97667 4 10.7617 4 12.3333V17.3333"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
            </svg>
          ),
        },
        {
          key: 'discount',
          label: 'Discount',
          className: 'custom-menuItem',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                opacity="0.5"
                d="M18.3332 10H1.6665M9.99984 1.66666V18.3333"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M10.833 10C10.833 10.8841 11.1842 11.7319 11.8093 12.357C12.4344 12.9821 13.2823 13.3333 14.1663 13.3333M9.16634 10C9.16634 10.8841 8.81515 11.7319 8.19003 12.357C7.56491 12.9821 6.71706 13.3333 5.83301 13.3333"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M9.9998 8.3625C9.99984 7.75901 10.2016 7.17285 10.5731 6.69721C10.9445 6.22158 11.4643 5.88377 12.0498 5.7375C13.3856 5.40417 14.5965 6.61417 14.2623 7.95083C14.116 8.53633 13.7782 9.05612 13.3026 9.42757C12.827 9.79902 12.2408 10.0008 11.6373 10.0008H9.9998M9.9998 8.3625V10.0008M9.9998 8.3625C9.99977 7.75901 9.79799 7.17285 9.42654 6.69721C9.05509 6.22158 8.5353 5.88377 7.9498 5.7375C6.61397 5.40417 5.40314 6.61417 5.7373 7.95083C5.88358 8.53633 6.22138 9.05612 6.69702 9.42757C7.17265 9.79902 7.75881 10.0008 8.3623 10.0008H9.9998"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                d="M1.6665 10C1.6665 6.07166 1.6665 4.1075 2.8865 2.88666C4.10817 1.66666 6.0715 1.66666 9.99984 1.66666C13.9282 1.66666 15.8923 1.66666 17.1123 2.88666C18.3332 4.10833 18.3332 6.07166 18.3332 10C18.3332 13.9283 18.3332 15.8925 17.1123 17.1125C15.8932 18.3333 13.9282 18.3333 9.99984 18.3333C6.0715 18.3333 4.10734 18.3333 2.8865 17.1125C1.6665 15.8933 1.6665 13.9283 1.6665 10Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.5"
              />
            </svg>
          ),
        },
        {
          key: 'pricing',
          label: 'Pricing',
          className: 'custom-menuItem',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                opacity="0.5"
                d="M2.94021 12.4475C1.65271 11.1592 1.00855 10.5158 0.769381 9.68C0.529381 8.84416 0.734381 7.95666 1.14438 6.1825L1.38021 5.15916C1.72438 3.66583 1.89688 2.91916 2.40771 2.4075C2.91938 1.89666 3.66605 1.72416 5.15938 1.38L6.18271 1.14333C7.95771 0.734163 8.84438 0.529163 9.68021 0.768329C10.516 1.00833 11.1594 1.6525 12.4469 2.94L13.9719 4.465C16.2144 6.70666 17.3335 7.82666 17.3335 9.21833C17.3335 10.6108 16.2135 11.7308 13.9727 13.9717C11.731 16.2133 10.611 17.3333 9.21855 17.3333C7.82688 17.3333 6.70605 16.2133 4.46521 13.9725L2.94021 12.4475Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                d="M11.8252 11.825C12.3127 11.3358 12.3785 10.6108 11.9718 10.2033C11.5652 9.79666 10.8393 9.86249 10.351 10.3508C9.86349 10.8392 9.13765 10.905 8.73099 10.4983C8.32432 10.0917 8.39015 9.36583 8.87849 8.87833M8.87849 8.87833L8.58349 8.58333M8.87849 8.87833C9.15432 8.60166 9.50599 8.46166 9.83349 8.46416M12.1193 12.1192L11.8243 11.8242C11.491 12.1583 11.0452 12.295 10.6668 12.2167"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M7.35145 7.57768C8.00233 6.92681 8.00233 5.87153 7.35145 5.22066C6.70058 4.56978 5.6453 4.56978 4.99443 5.22066C4.34356 5.87153 4.34356 6.92681 4.99443 7.57768C5.6453 8.22855 6.70058 8.22855 7.35145 7.57768Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
            </svg>
          ),
        },
        {
          key: 'customers',
          label: 'Customers',
          className: 'custom-menuItem',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M6.49984 7.33334C8.34079 7.33334 9.83317 5.84095 9.83317 4.00001C9.83317 2.15906 8.34079 0.666672 6.49984 0.666672C4.65889 0.666672 3.1665 2.15906 3.1665 4.00001C3.1665 5.84095 4.65889 7.33334 6.49984 7.33334Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                opacity="0.5"
                d="M9.4165 2.6175C9.71346 2.17008 10.1466 1.83018 10.6518 1.6481C11.157 1.46602 11.7074 1.45144 12.2215 1.60653C12.7356 1.76162 13.1861 2.07813 13.5063 2.5092C13.8265 2.94028 13.9995 3.463 13.9995 4C13.9995 4.537 13.8265 5.05972 13.5063 5.4908C13.1861 5.92187 12.7356 6.23838 12.2215 6.39347C11.7074 6.54856 11.157 6.53398 10.6518 6.3519C10.1466 6.16982 9.71346 5.82992 9.4165 5.3825"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                d="M6.49984 16.5C9.7215 16.5 12.3332 15.0076 12.3332 13.1667C12.3332 11.3257 9.7215 9.83334 6.49984 9.83334C3.27818 9.83334 0.666504 11.3257 0.666504 13.1667C0.666504 15.0076 3.27818 16.5 6.49984 16.5Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                opacity="0.5"
                d="M14 10.6667C15.4617 10.9875 16.5 11.7992 16.5 12.75C16.5 13.6083 15.655 14.3525 14.4167 14.725"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ),
        },
        {
          key: 'orders',
          label: 'Orders',
          className: 'custom-menuItem',

          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="18"
              viewBox="0 0 17 18"
              fill="none"
            >
              <path
                d="M0.666504 1.5L0.887337 1.57333C1.98734 1.94 2.53734 2.12333 2.8515 2.56C3.1665 2.99667 3.1665 3.57667 3.1665 4.73583V6.91667C3.1665 9.27333 3.1665 10.4525 3.899 11.1842C4.63067 11.9167 5.80984 11.9167 8.1665 11.9167H14.8332"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                opacity="0.5"
                d="M5.25 14C5.58152 14 5.89946 14.1317 6.13388 14.3661C6.3683 14.6005 6.5 14.9185 6.5 15.25C6.5 15.5815 6.3683 15.8995 6.13388 16.1339C5.89946 16.3683 5.58152 16.5 5.25 16.5C4.91848 16.5 4.60054 16.3683 4.36612 16.1339C4.1317 15.8995 4 15.5815 4 15.25C4 14.9185 4.1317 14.6005 4.36612 14.3661C4.60054 14.1317 4.91848 14 5.25 14ZM12.75 14C13.0815 14 13.3995 14.1317 13.6339 14.3661C13.8683 14.6005 14 14.9185 14 15.25C14 15.5815 13.8683 15.8995 13.6339 16.1339C13.3995 16.3683 13.0815 16.5 12.75 16.5C12.4185 16.5 12.1005 16.3683 11.8661 16.1339C11.6317 15.8995 11.5 15.5815 11.5 15.25C11.5 14.9185 11.6317 14.6005 11.8661 14.3661C12.1005 14.1317 12.4185 14 12.75 14Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                d="M3.1665 4H12.7082C14.4207 4 15.2773 4 15.6482 4.56167C16.0182 5.12417 15.6815 5.91083 15.0065 7.485L14.649 8.31833C14.334 9.05333 14.1765 9.42 13.864 9.62667C13.5507 9.83333 13.1507 9.83333 12.3515 9.83333H3.1665"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
            </svg>
          ),
        },
        {
          key: 'analytic',
          label: 'Analytic',
          className: '',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                opacity="0.5"
                d="M0.666504 8.99999C0.666504 5.07166 0.666504 3.10749 1.8865 1.88666C3.10817 0.666656 5.0715 0.666656 8.99984 0.666656C12.9282 0.666656 14.8923 0.666656 16.1123 1.88666C17.3332 3.10832 17.3332 5.07166 17.3332 8.99999C17.3332 12.9283 17.3332 14.8925 16.1123 16.1125C14.8932 17.3333 12.9282 17.3333 8.99984 17.3333C5.0715 17.3333 3.10734 17.3333 1.8865 16.1125C0.666504 14.8933 0.666504 12.9283 0.666504 8.99999Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                d="M4.83301 14V6.5M8.99967 14V4M13.1663 14V9.83333"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          ),
          children: [
            {
              key: 'overview',
              label: 'Overview',
              icon: (
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <i className="text-[0.5rem] text-[#919EAB] fa-solid fa-diamond"></i>
                </div>
              ),
              className: 'p-[0_12px] m-0',
            },
            {
              key: 'analyticReport',
              label: 'Report',
              icon: (
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <i className="text-[0.5rem] text-[#919EAB] fa-solid fa-diamond"></i>
                </div>
              ),
            },
            {
              key: 'liveView',
              label: 'Live View',
              icon: (
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <i className="text-[0.5rem] text-[#919EAB] fa-solid fa-diamond"></i>
                </div>
              ),
            },
          ],
        },
      ],
    },
    {
      className: 'custom-menuGroup',
      type: 'group',
      label: (
        <span className="px-3 uppercase font-semibold text-sm">Tools</span>
      ),
      children: [
        {
          key: 'SEO',
          label: 'SEO',
          className: '',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                opacity="0.5"
                d="M0.666504 9.00001C0.666504 5.07167 0.666504 3.10751 1.8865 1.88667C3.10817 0.666672 5.0715 0.666672 8.99984 0.666672C12.9282 0.666672 14.8923 0.666672 16.1123 1.88667C17.3332 3.10834 17.3332 5.07167 17.3332 9.00001C17.3332 12.9283 17.3332 14.8925 16.1123 16.1125C14.8932 17.3333 12.9282 17.3333 8.99984 17.3333C5.0715 17.3333 3.10734 17.3333 1.8865 16.1125C0.666504 14.8933 0.666504 12.9283 0.666504 9.00001Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
              <path
                d="M4.83301 10.6667L6.74384 8.75584C6.90011 8.59962 7.11204 8.51185 7.33301 8.51185C7.55398 8.51185 7.7659 8.59962 7.92217 8.75584L9.24384 10.0775C9.40011 10.2337 9.61204 10.3215 9.83301 10.3215C10.054 10.3215 10.2659 10.2337 10.4222 10.0775L13.1663 7.33334M13.1663 7.33334V9.41668M13.1663 7.33334H11.083"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          children: [
            {
              key: 'sitemap',
              label: 'Sitemap',
              icon: (
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <i className="text-[0.5rem] text-[#919EAB] fa-solid fa-diamond"></i>
                </div>
              ),
            },
            {
              key: '404-301',
              label: '404 & 301',
              icon: (
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <i className="text-[0.5rem] text-[#919EAB] fa-solid fa-diamond"></i>
                </div>
              ),
              style: { padding: '0 12px', margin: 0 },
            },
            {
              key: 'indexing',
              label: 'Instant Indexing',
              icon: (
                <div className="w-[18px] h-[18px] flex items-center justify-center">
                  <i className="text-[0.5rem] text-[#919EAB] fa-solid fa-diamond"></i>
                </div>
              ),
              style: { padding: '0 12px', margin: 0 },
            },
          ],
        },
        {
          key: 'report',
          label: 'Report',
          className: 'custom-menuItem',

          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                opacity="0.5"
                d="M1.5 17.3333H16.5"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.5 8.16666C1.5 7.38082 1.5 6.98832 1.74417 6.74416C1.98833 6.49999 2.38083 6.49999 3.16667 6.49999C3.9525 6.49999 4.345 6.49999 4.58917 6.74416C4.83333 6.98832 4.83333 7.38082 4.83333 8.16666V13.1667C4.83333 13.9525 4.83333 14.345 4.58917 14.5892C4.345 14.8333 3.9525 14.8333 3.16667 14.8333C2.38083 14.8333 1.98833 14.8333 1.74417 14.5892C1.5 14.345 1.5 13.9525 1.5 13.1667V8.16666ZM7.33333 4.83332C7.33333 4.04749 7.33333 3.65499 7.5775 3.41082C7.82167 3.16666 8.21417 3.16666 9 3.16666C9.78583 3.16666 10.1783 3.16666 10.4225 3.41082C10.6667 3.65499 10.6667 4.04749 10.6667 4.83332V13.1667C10.6667 13.9525 10.6667 14.345 10.4225 14.5892C10.1783 14.8333 9.78583 14.8333 9 14.8333C8.21417 14.8333 7.82167 14.8333 7.5775 14.5892C7.33333 14.345 7.33333 13.9525 7.33333 13.1667V4.83332ZM13.1667 2.33332C13.1667 1.54749 13.1667 1.15499 13.4108 0.910823C13.655 0.666656 14.0475 0.666656 14.8333 0.666656C15.6192 0.666656 16.0117 0.666656 16.2558 0.910823C16.5 1.15499 16.5 1.54749 16.5 2.33332V13.1667C16.5 13.9525 16.5 14.345 16.2558 14.5892C16.0117 14.8333 15.6192 14.8333 14.8333 14.8333C14.0475 14.8333 13.655 14.8333 13.4108 14.5892C13.1667 14.345 13.1667 13.9525 13.1667 13.1667V2.33332Z"
                stroke="#333333"
                className="stroke"
                strokeWidth="1.2"
              />
            </svg>
          ),
        },
      ],
    },
    {
      className: 'custom-menuGroup',
      type: 'group',
      label: (
        <span className="px-3 uppercase font-semibold text-sm">SYSTEM</span>
      ),
      children: [
        {
          key: 'user',
          label: 'User',

          icon: <UserCircleIcon size={18} strokeWidth={1.5} />,
        },
        {
          key: 'role',
          label: 'Role',

          icon: <UserCircleIcon size={18} strokeWidth={1.5} />,
        },
        {
          key: 'setting',
          label: 'Setting',
          icon: <Settings01Icon size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  const filterMenuItems = items => {
    return items
      .map(item => {
        if (item.children) {
          const filteredChildren = filterMenuItems(item.children);
          return filteredChildren.length > 0
            ? { ...item, children: filteredChildren }
            : null;
        }
        return hasPermission(
          permissionData || {
            assets: [],
            documents: [],
            objects: [],
            others: [],
          },
          'others',
          item.key,
          'listing',
        )
          ? item
          : null;
      })
      .filter(item => item !== null) as MenuItem[];
  };

  const filteredItems = isAdmin ? items : filterMenuItems(items);

  const hasContentGroup = filteredItems.some(item =>
    item?.className?.includes('content'),
  );

  const objectGroup: MenuItem = {
    className: 'custom-menuGroup',
    type: 'group',
    label: (
      <span className="px-3 uppercase font-semibold text-sm">content</span>
    ),
    children: [...objectItem],
  };

  if (!hasContentGroup) {
    filteredItems.push(objectGroup);
  } else {
    const contentGroup = filteredItems.find(item =>
      item?.className?.includes('content'),
    );
    if (contentGroup && 'children' in contentGroup) {
      contentGroup.children = [...(contentGroup.children || []), ...objectItem];
    }
  }

  return (
    <LayoutWrapper className="w-screen h-screen flex">
      <Flex
        vertical
        className="w-[240px] flex-none h-full bg-slate-50 border-r border-slate-200"
      >
        <div className="flex-none px-5 py-2">
          <div className="h-[48px] w-auto">
            <img
              src={corepulseRoot + '/static/images/logo.png'}
              alt=""
              className="w-auto h-full object-contain"
            />
          </div>
        </div>
        <Flex vertical className="flex-1 px-4 overflow-auto">
          <Menu
            selectedKeys={[object || pathname.replace(/\//g, '')]}
            onClick={handleSelect}
            inlineIndent={12}
            className="bg-transparent !border-none"
            mode="inline"
            items={filteredItems}
          />
          <Search
            open={isSeachOpen}
            onClose={() => {
              setIsSeachOpen(false);
            }}
          />
        </Flex>
        <Logout />
      </Flex>
      <Outlet />
    </LayoutWrapper>
  );
}
