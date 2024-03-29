import { Divider, Input } from 'antd';
import React, { useState } from 'react';
import HighlightTitle from '../index';

const arr = [
  { title: '我叫小明', key: 'ming' },
  { title: '我叫小白', key: 'bai' },
  { title: '我叫小红', key: 'hong' },
  { title: '我叫小紫', key: 'zi' },
];
const Demo: React.FC = () => {
  const [value, setValue] = useState('');
  return (
    <>
      <div>匹配关键字：</div>
      <HighlightTitle
        text="支持关键字高亮支持关键字高亮支持关键字高亮"
        keyWord="关键字"
      />
      <Divider />

      <div>自定义关键字样式：</div>
      <HighlightTitle
        text="支持关键字高亮"
        keyWord="关键字"
        style={{ color: 'green', fontWeight: 'bold' }}
      />

      <Divider />

      <div>
        <Input
          onChange={(e) => setValue(e.target.value)}
          placeholder="请输入"
        />

        {arr.map(({ title, key }) => (
          <div key={key}>
            <HighlightTitle text={title} keyWord={value} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Demo;
