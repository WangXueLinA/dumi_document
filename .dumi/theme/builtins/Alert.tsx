// 注意组件
import { Alert as AlertMsg, List } from 'antd';
import { type FC } from 'react';

const Alert: FC<{
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  children?: React.ReactNode;
}> = ({ message = '', type = 'error', children }) => {
  const block = <List>{children}</List>;
  return (
    <AlertMsg
      message={type === 'error' ? `⚠️ 注意：${message}` : message}
      type={type}
      style={{ marginBlock: 12 }}
      description={!message ? block : null}
    ></AlertMsg>
  );
};

export default Alert;
