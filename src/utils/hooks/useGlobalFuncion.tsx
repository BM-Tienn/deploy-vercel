import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setCookie } from 'utils/cookies';
import { Token } from 'utils/types/const';
import { globalActions } from 'app/slice';
export const useGlobalFunctions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogin = useCallback(
    data => {
      setCookie(Token, data.authToken);
      dispatch(globalActions.loginSuccesses());
      navigate('/');
    },
    [dispatch, navigate],
  );

  return useMemo(() => ({ onLogin }), [onLogin]);
};
