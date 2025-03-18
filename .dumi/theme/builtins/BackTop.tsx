// 返回页面顶部的操作按钮。

import { FloatButton } from 'antd';
import { type FC } from 'react';

const BackTop: FC<{}> = () => {
  return (
    <FloatButton.BackTop
      icon={<img src="/back.gif" className="float-button-backTop" />}
      tooltip="返回顶部"
    />
  );
};

export default BackTop;
