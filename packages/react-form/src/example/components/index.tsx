import {
  Button,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  DatePicker as _DatePicker,
} from 'antd';
import moment from 'moment';
import { ComponentProps } from 'react';
import { registerComponent, withDynamicData } from '../../index';
import AddandDel from './AddandDel';
import FormList from './FormList';
import HeightBtn from './HeightBtn';
import SubmitBtn from './SubmitBtn';
import TableBtn from './TableBtn';
import Text from './Text';

export const HotSelect = withDynamicData<ComponentProps<typeof Select>>(
  (props) => <Select {...props} style={{ width: '100%' }} />,
);

export const DatePicker = ({ value, ...props }: { value: moment.Moment }) => {
  return <_DatePicker {...props} value={value ? moment(value) : value} />;
};
const RadioGroup = Radio.Group;
const components = {
  Input,
  InputNum: InputNumber,
  Select,
  RadioGroup,
  HotSelect,
  DatePicker,
  Button,
  SubmitBtn,
  InputNumber,
  AddandDel,
  HeightBtn,
  FormList,
  TableBtn,
  Text,
  Switch,
};
registerComponent(components);
export type ComponentMap = typeof components;
