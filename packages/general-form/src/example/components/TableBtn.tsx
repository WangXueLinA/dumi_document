import { Button } from 'antd';
import { defineComponent } from '../../index';

type Props = {
  index: number;
  tableField: string;
};

export default defineComponent<Props>((props) => {
  return (
    <>
      <Button
        size="small"
        type="link"
        onClick={() => {
          if (!props.tableField) return;
          const d = [...(props.context?.getValue(props.tableField) || [])];
          d.splice(props.index, 1);
          props.context?.setValue(props.tableField, d);
        }}
      >
        删除
      </Button>
    </>
  );
});
