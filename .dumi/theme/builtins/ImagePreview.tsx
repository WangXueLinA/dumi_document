// 点击图片放大组件
import { type FC, useState } from 'react';
import Viewer from 'react-viewer';

const ImagePreview: FC<{ src: string }> = ({ src }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <img
        src={src}
        alt="图片加载失败"
        onClick={() => {
          setVisible(true);
        }}
        style={{
          cursor: 'zoom-in',
          maxWidth: '100%',
          marginBlockStart: 12,
          marginBlockEnd: 24,
        }}
      />
      <Viewer
        visible={visible}
        noNavbar={true}
        noImgDetails={true}
        onClose={() => {
          setVisible(false);
        }}
        images={[{ src, alt: '' }]}
      />
    </div>
  );
};

export default ImagePreview;
