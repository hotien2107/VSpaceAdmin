import Footer from '@/components/Footer';
import {
  AlipayCircleOutlined,
  LockOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import React from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useModel } from 'umi';
import { saveDataLocal } from '../../../helpers/localStorage';
import LoginProxy from '../../../services/proxy/auth/login';
import { useAppDispatch } from '../../../stores';
import { setAuthenticated, setUserInfo } from '../../../stores/auth-slice';
import { ProxyStatusEnum } from '../../../types/http/proxy/ProxyStatus';
import styles from './index.less';
import type { LoginFormValues } from './type';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');

  const handleSubmit = (values: LoginFormValues) => {
    console.log(values);
    LoginProxy({
      email: values.email,
      password: values.password,
    })
      .then((res) => {
        console.log(res);
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultLoginFailureMessage = intl.formatMessage({
            id: 'pages.login.failure',
            defaultMessage: res.message ?? 'Login fail',
          });
          message.error(defaultLoginFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultLoginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: 'Success!',
          });
          saveDataLocal('user_id', res.data.userInfo.id.toString());
          saveDataLocal('user_info', JSON.stringify(res.data.userInfo));
          saveDataLocal('access_token', res.data.accessToken);
          saveDataLocal('refresh_token', res.data.refreshToken);
          dispatch(setUserInfo(res?.data.userInfo));
          dispatch(setAuthenticated(true));
          setInitialState(() => ({
            accessToken: initialState?.accessToken,
            refreshToken: initialState?.refreshToken,
            isAuthenticated: true,
            user: res.data.userInfo,
          }));
          message.success(defaultLoginSuccessMessage);
          history.push('/');
          return;
        }
      })
      .catch((err) => {
        const defaultLoginFailureMessage = intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: err.message ?? 'Login fail',
        });
        message.error(defaultLoginFailureMessage);
      })
      .finally(() => {});
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Ant Design"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            <FormattedMessage
              key="loginWith"
              id="pages.login.loginWith"
              defaultMessage="Login With"
            />,
            <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
            <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
            <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
          ]}
          onFinish={async (values) => {
            await handleSubmit(values as LoginFormValues);
          }}
        >
          <>
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.email.placeholder',
                defaultMessage: 'email',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.email.required"
                      defaultMessage="Email is required!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: 'password',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="Password is required"
                    />
                  ),
                },
              ]}
            />
          </>
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
