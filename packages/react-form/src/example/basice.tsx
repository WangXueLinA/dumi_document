import { Input, Radio } from 'antd';

import { Form, FormItem } from '../index';
import { defaultData, getList } from './api';
import { DatePicker, HotSelect } from './components';
import { useSubmit } from './hooks';

const RadioGroup = Radio.Group;
const isShow = {
  relyOn: {
    show: [true],
    sex: [1],
  },
};

export default () => {
  const submit = useSubmit();

  return (
    <Form defaultData={defaultData} span={8} onChange={(e) => {}}>
      <FormItem label="姓名" field="name">
        <Input />
      </FormItem>
      <FormItem label="年龄" field="age">
        <Input type="number" />
      </FormItem>
      <FormItem label="性别" field="sex">
        <RadioGroup
          style={{ display: 'flex' }}
          options={[
            { label: '男', value: 1 },
            { label: '女', value: 0 },
          ]}
        />
      </FormItem>
      <FormItem label="生日" field="birthday">
        <DatePicker value={undefined} />
      </FormItem>
      <FormItem label="省" field="province" isShow={isShow}>
        <HotSelect getList={getList} params={{ id: 0 }} />
      </FormItem>
      <FormItem label="市" field="city" isShow={isShow}>
        <HotSelect getList={getList} params={{ id: 'province' }} />
      </FormItem>
      <FormItem label="区" field="area" isShow={isShow}>
        <HotSelect getList={getList} params={{ id: 'city' }} />
      </FormItem>
      <FormItem field="show" span={10} el="HeightBtn" submit={submit} />
    </Form>
  );
};
