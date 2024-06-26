import { Button } from 'antd';
import { defineComponent } from '../../index';

type Props = {
  dataSource: any;
  index: number;
  onDataChange(data: any): void;
};

export default defineComponent<Props>((props) => {
  return (
    <>
      <Button
        size="small"
        type="link"
        onClick={() => {
          props.context?.getValues().push({});
          props.onDataChange([...(props.context?.getValues() as [])]);
        }}
      >
        添加
      </Button>
      {props.index > 0 && (
        <Button
          size="small"
          type="link"
          onClick={() => {
            const d = [...(props.context?.getValues() as [])];
            d.splice(props.index, 1);
            props.onDataChange(d);
          }}
        >
          删除
        </Button>
      )}
    </>
  );
});
