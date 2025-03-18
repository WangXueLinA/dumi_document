import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {
  Divider,
  DropDownProps,
  Dropdown,
  Menu,
  Space,
  SpaceProps,
} from 'antd';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export type ResizeConfig = {
  itemWidth?: number;
  line?: number;
};

export type Props = {
  count?: number;
  trigger?: ('contextMenu' | 'click' | 'hover')[];
  moreText?: React.ReactNode;
  overlayClassName?: DropDownProps['className'];
  placement?: DropDownProps['placement'];
  getPopupContainer?: DropDownProps['getPopupContainer'];
  resizeConfig?: ResizeConfig;
  moreAll?: boolean;
  moreTextIcon?: boolean;
  overlayRender?: (
    overlay: DropDownProps['overlay'],
    more?: React.ReactElement<any, string | React.JSXElementConstructor<any>>[],
  ) => DropDownProps['overlay'];
} & SpaceProps;

const defaultTrigger: Props['trigger'] = ['click'];
const defaultSplit = <Divider type="vertical" />;

const OperationGroup: React.FC<Props> = ({
  children,
  split = defaultSplit,
  count: _count = 2,
  trigger = defaultTrigger,
  moreText = '更多',
  moreTextIcon = true,
  placement = 'bottomCenter',
  getPopupContainer,
  resizeConfig,
  moreAll,
  overlayRender,
  overlayClassName,
  className,
  style,
  ...rest
}) => {
  const resizeInfo = useRef<ResizeConfig>();
  resizeInfo.current = resizeConfig;
  const [count, setCount] = useState(_count);
  const container = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const updateHandle = useCallback(() => {
    const { line, itemWidth } = resizeInfo.current || {};
    const width = container.current?.clientWidth || 0;
    if (line && itemWidth) {
      setCount(Math.floor(width / itemWidth) * line - 1);
    }
  }, []);

  const resizeObserver = useRef(new ResizeObserver(updateHandle));

  useEffect(() => {
    updateHandle();
  }, [resizeConfig]);

  useEffect(() => {
    if (container.current && resizeConfig) {
      console.log(container.current, resizeObserver?.current?.unobserve);
      resizeObserver.current.observe(container.current);
      return () =>
        container.current &&
        resizeObserver?.current?.unobserve(container.current!);
    }
    setCount(_count);
  }, [resizeConfig]);

  const content = useMemo(() => {
    const list =
      React.Children.map<React.ReactElement, React.ReactElement>(
        children as React.ReactElement,
        (item) => {
          if (
            React.isValidElement<any>(item) &&
            item.type === React.Fragment &&
            item.props.children
          ) {
            return item.props.children;
          }
          return item;
        },
      )
        ?.flat()
        ?.filter(Boolean) ?? [];
    const arr = list?.slice(0, count);
    const more = moreAll ? list : list?.slice(count);

    if (list.length > count + 1) {
      const overlay = (
        <Menu>
          {more.map((item) => (
            <Menu.Item>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {item}
              </div>
            </Menu.Item>
          ))}
        </Menu>
      );
      arr?.push(
        <Dropdown
          overlayStyle={{ zIndex: 100 }}
          overlayClassName={overlayClassName}
          overlay={overlayRender ? overlayRender(overlay, more) : overlay}
          placement={placement}
          trigger={trigger}
          getPopupContainer={getPopupContainer}
          onVisibleChange={(visible: boolean) => {
            setIsDropdownOpen(visible);
          }}
        >
          <a style={{ display: 'flex' }}>
            {moreText}
            {moreTextIcon && (
              <span style={{ marginLeft: 5 }}>
                {isDropdownOpen ? <UpOutlined /> : <DownOutlined />}
              </span>
            )}
          </a>
        </Dropdown>,
      );
      return arr;
    }
    return list;
  }, [
    children,
    count,
    getPopupContainer,
    moreText,
    placement,
    trigger,
    isDropdownOpen,
  ]);

  return (
    <div ref={container} className={className} style={style}>
      <Space split={split} {...rest}>
        {content}
      </Space>
    </div>
  );
};

export default OperationGroup;
