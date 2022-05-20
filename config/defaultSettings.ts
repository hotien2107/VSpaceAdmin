import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Vispace Admin',
  pwa: false,
  logo: 'http://res.cloudinary.com/dcm0ibm0b/image/upload/v1652723843/dew54xnglkgsiukhzbw6.svg',
  iconfontUrl: '',
};

export default Settings;
