import { Space } from 'antd';
import React from 'react';
import { SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const className = styles.right;

  return (
    <Space className={className}>
      <Avatar menu />
      <SelectLang className={styles.action} />
    </Space>
  );
};

export default GlobalHeaderRight;
