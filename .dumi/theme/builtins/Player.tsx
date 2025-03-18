// 视频播放组件
import { type FC } from 'react';
import Player from 'react-player';

const VideoPlayer: FC<{ src: string }> = ({ src }) => {
  return (
    <Player
      url={src}
      loop={true}
      playing
      controls
      width={'max-width'}
      style={{
        maxWidth: '100%',
        marginBlockStart: 20,
      }}
    />
  );
};

export default VideoPlayer;
