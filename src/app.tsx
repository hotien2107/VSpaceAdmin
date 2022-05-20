import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { PageLoading } from '@ant-design/pro-layout';
import { Provider } from 'react-redux';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import { getDataLocal } from './helpers/localStorage';
import store from './stores';

const loginPath = '/user/login';

export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState() {
  const isAuth = getDataLocal('user_id') !== null;
  const userInfo = getDataLocal('user_info');
  const accessToken = getDataLocal('access_token');
  const refreshToken = getDataLocal('refresh_token');

  return {
    isAuthenticated: isAuth,
    user: userInfo,
    accessToken: accessToken,
    refreshToken,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    childrenRender: (children) => {
      return <Provider store={store}>{children}</Provider>;
    },
    rightContentRender: () => <Provider store={store}><RightContent /></Provider>,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      console.log(!initialState?.isAuthenticated)
      if (!initialState?.isAuthenticated) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
  };
};
