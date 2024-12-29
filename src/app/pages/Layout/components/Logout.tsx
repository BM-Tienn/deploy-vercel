import { Button, Popover, Flex } from 'antd';
import { getMessage } from 'app/functions/openNotificationWithIcon';
import { corepulseRoot } from 'app/routesConfig';
import { globalActions } from 'app/slice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOutAPI } from 'services/accountApi';
import { removeCookie } from 'utils/cookies';
import { Token } from 'utils/types/const';

export interface LogoutProps {}

export function Logout(props: LogoutProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <Popover
      placement="top"
      overlayInnerStyle={{ padding: 0 }}
      content={
        <Button
          loading={loading}
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              await logOutAPI();
              removeCookie(Token);
              dispatch(globalActions.clearData());
            } catch ({ response }: any) {
              getMessage(response);
            } finally {
              setLoading(false);
              navigate(`${corepulseRoot}/login`);
            }
          }}
          type="text"
          icon={<i className="fa-solid fa-right-from-bracket"></i>}
        >
          Log out
        </Button>
      }
      trigger="click"
    >
      <Flex
        align="center"
        gap={8}
        className="flex-none border-t-[1px] border-solid border-slate-200 px-5 py-2"
      >
        <div className="w-[48px] aspect-square rounded-[50%] overflow-hidden">
          <img
            src={process.env.REACT_APP_SUB_DIR + '/static/images/avatar.png'}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-semibold text-sm">Starfruit JSC</span>
      </Flex>
    </Popover>
  );
}
