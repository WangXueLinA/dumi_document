import { SmileOutlined } from '@ant-design/icons';
import { FloatButton, notification, Tabs, Timeline } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import commits from '../git-commits.json';
import SideTab from '../SideTab';
import { toolsArr } from '../utils';
import './index.less';

export default () => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('框架');
  const [api, contextHolder] = notification.useNotification({
    top: 70,
    duration: 4,
  });

  const openNotification = () => {
    api.open({
      message: '文档更新记录🔥🔥🔥🔥',
      description: (
        <Timeline
          items={commits.map((item) => ({
            children: `${item.date} --- ${item.message}`,
            color: 'darkcyan',
            dot: <SmileOutlined />,
          }))}
          style={{ marginTop: 25 }}
        />
      ),
    });
  };

  useEffect(() => {
    openNotification();
  }, []);

  return (
    <>
      {contextHolder}
      <div className="dumi-div-box">
        <h1 className="dumi-h1-title">
          <span>document</span>
        </h1>
        <p className="dumi-p-title">前端学习笔记</p>
      </div>
      <Tabs
        activeKey={activeKey}
        onChange={(e) => setActiveKey(e)}
        centered
        items={Object.keys(toolsArr).map((item) => {
          return {
            label: item,
            key: item,
            children: Array.isArray(toolsArr[item]) ? (
              <div className="dumi-site-who-are-using">
                {toolsArr[item].map((key) => (
                  <Link to={`${location.pathname}note/${key.title}`}>
                    <img src={key.logoUrl} alt="Ant Design" />
                    {key.title}
                  </Link>
                ))}
              </div>
            ) : (
              Object.keys(toolsArr[item]).map((_item) => {
                const someId = toolsArr[item][_item];
                return (
                  <>
                    <div className="dumi-site-who-are">{_item}</div>
                    <div className="dumi-site-who-are-using">
                      {someId.map((key) => (
                        <Link to={`${location.pathname}note/${key.title}`}>
                          <img src={key.logoUrl} alt="Ant Design" />
                          {key.title}
                        </Link>
                      ))}
                    </div>
                  </>
                );
              })
            ),
          };
        })}
      />
      <SideTab />

      <FloatButton
        onClick={openNotification}
        icon={<img src="/homeTip.gif" className="float-button-homeTip" />}
      ></FloatButton>
    </>
  );
};
