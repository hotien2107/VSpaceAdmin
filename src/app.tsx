import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { Provider } from 'react-redux';
import store from './stores';
import { useSelector } from 'react-redux'



const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  isAuthenticated?: boolean;
}> {

  const { isAuthenticated } = useSelector((state: any) => state.auth)
  console.log(isAuthenticated);
  return {
    isAuthenticated: isAuthenticated,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    childrenRender: (children) => {
      return <Provider store={store}>{children}</Provider>;
    },
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      console.log(initialState);
      // 如果没有登录，重定向到 login
      if (!initialState?.isAuthenticated) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
  };
};
