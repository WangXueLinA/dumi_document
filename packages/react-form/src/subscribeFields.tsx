import { ComponentType } from 'react';
import { useWatch } from './hooks';
import { RenderProps } from './interface';

type Props = {
  fields: string[];
} & RenderProps;

export default function <T>(Comp: ComponentType<T>) {
  return (props: T & Props) => {
    useWatch(props.fields, undefined, undefined, { deep: true });
    return <Comp {...props} />;
  };
}
