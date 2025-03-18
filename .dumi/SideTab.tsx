import classNames from 'classnames';
import { useEffect, useState } from 'react';

const weekDay = {
  '1': '周一',
  '2': '周二',
  '3': '周三',
  '4': '周四',
  '5': '周五',
  '6': '周六',
  '7': '周日',
};

export default () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % Object.keys(weekDay).length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="nav">
      <ul>
        {Object.keys(weekDay).map((item, index) => (
          <li
            key={item}
            onClick={() => setSelectedIndex(index)}
            className={classNames({
              active: selectedIndex === index,
            })}
          >
            <span
              style={{
                width: selectedIndex === index && index === 2 ? 55 : 60,
                height: selectedIndex !== index && index === 2 ? 55 : 60,
              }}
            >
              <div
                className={classNames({
                  'active-div': selectedIndex !== index,
                })}
              >
                {weekDay[item as keyof typeof weekDay]}
              </div>
              <img
                src={`/banner${index + 1}.gif`}
                className={classNames({
                  'active-image': selectedIndex === index,
                  'inactive-image': selectedIndex !== index,
                })}
              />
              <img
                src={`/banner${index + 1}.jpg`}
                className={classNames({
                  'active-image': selectedIndex !== index,
                  'inactive-image': selectedIndex === index,
                })}
              />
            </span>
          </li>
        ))}
        <div className="indicator"></div>
      </ul>
    </div>
  );
};
