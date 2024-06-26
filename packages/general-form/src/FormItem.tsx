import React, {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { RenderProps, useFormInstance } from './index';
import { FormItemProps } from './interface';
import { useDeepEqualLayoutEffect } from './useDeepEqualEffect';
import { components } from './utils';

const getTriggerType = (rules: FormItemProps['rules']) => {
  const triggerKey = 'onChange';
  if (!rules) return triggerKey;
  return (Array.isArray(rules) ? rules : [rules]).reduce((str, { trigger }) => {
    if (trigger) str = trigger;
    return str;
  }, 'onChange');
};

const FormItem = (props: FormItemProps) => {
  const {
    el,
    field,
    span,
    offset,
    label,
    labelWidth,
    minItemWidth,
    itemClassName,
    itemStyle,
    labelAlign,
    required,
    rules,
    errorMsg,
    onChange,
    children,
    xs,
    sm,
    md,
    lg,
    xl,
    isShow,
    content,
    doNotRegister,
    context: _context,
    rightInfo,
    bottomInfo,
    defaultValue,
    ...other
  } = props;
  const contextData = useFormInstance();
  const [, updateState] = useState({});
  const itemRef = useRef<any>({});

  const getIsShow = (show: FormItemProps['isShow']) => {
    if (typeof show === 'boolean') {
      return show;
    }
    const keys = Object.keys(show?.relyOn ?? {});
    if (keys.length) {
      if (typeof show === 'object') {
        const method = show.relation === 'and' ? 'every' : 'some';
        let _isShow = keys[method]((k) => {
          const val = show.relyOn[k];
          let flag = true;
          if (Array.isArray(val)) {
            flag = val?.includes(contextData.getValue(k));
          } else if (typeof val === 'string') {
            try {
              const fn = new Function(`return ${val}`)();
              flag = fn(contextData.getValue(k), contextData);
            } catch (error) {
              flag = false;
              console.error(error);
            }
          } else {
            flag = val(contextData.getValue(k), contextData);
          }
          return show.notIn ? !flag : flag;
        });
        if (typeof show.external === 'boolean') {
          _isShow =
            show.relation === 'and'
              ? _isShow && show.external
              : _isShow || show.external;
        }
        return _isShow;
      }
    }
    return true;
  };

  const itemInstance = useRef({
    setErrorMsg(errMsg?: string) {
      itemInstance.current.errorMsg = errMsg;
      updateState({});
    },
    setSateShow(flag: boolean) {
      itemInstance.current.show = flag;
      if (field) {
        contextData.clearValidate([field]);
      }
      updateState({});
    },
    errorMsg,
    defaultValue,
    value: (field ? contextData.getValue(field) : other.value) ?? defaultValue,
    show: getIsShow(isShow),
    rules,
  });

  itemInstance.current.rules = rules;

  const isRequired = useMemo(() => {
    if (!rules) return required;
    if (Array.isArray(rules)) return rules.some((item) => item.required);
    return rules.required;
  }, [required, rules]);

  const textAlign = labelAlign ?? contextData.labelAlign;
  const labelStyles = {
    width: labelWidth ?? contextData.labelWidth,
    textAlign: textAlign === 'top' ? 'left' : textAlign,
  };

  const handlerChange = (e: any, ...args: any[]) => {
    let value!: any;
    try {
      if (typeof e?.stopPropagation === 'function') {
        e.stopPropagation();
      }
      value = e.target.value;
    } catch (error) {
      value = e;
    }
    if (field) {
      contextData.onFiledChange(field, {
        value,
        e,
        ...args,
        rules,
        oldVal: itemInstance.current.value,
      });
    }
    onChange?.(e, ...args);
  };

  useEffect(() => {
    if (!field) return;
    return contextData.subscribe(
      [field],
      (k, { value }) => {
        itemInstance.current.value = value;
        updateState({});
      },
      { deep: true },
    );
  }, [field]);

  useLayoutEffect(() => {
    if (field) {
      return contextData.onLifeCycle(field, itemInstance.current);
    }
  }, [field]);

  useLayoutEffect(() => {
    itemInstance.current.setErrorMsg(errorMsg);
  }, [errorMsg]);

  useDeepEqualLayoutEffect(() => {
    if (typeof isShow === 'boolean') {
      itemInstance.current.setSateShow(isShow);
    } else {
      const keys = Object.keys(isShow?.relyOn ?? {});
      if (keys.length) {
        return contextData.subscribe(keys, () => {
          itemInstance.current.setSateShow(getIsShow(isShow));
        });
      }
      itemInstance.current.setSateShow(true);
    }
  }, [isShow]);

  const getChildren = () => {
    let child: any = children ?? el;
    if (child) {
      Object.assign(
        itemRef.current,
        itemInstance.current,
        contextData,
        _context ?? {},
        {
          field,
          labelWidth: labelStyles.width,
          labelAlign: textAlign,
        },
      );
      const propsData: PropsWithChildren<RenderProps> = {
        context: itemRef.current,
        field,
        size: other.size ?? contextData.size,
        disabled: other.disabled ?? contextData.disabled,
        children: content,
        value: itemInstance.current.value,
        ...other,
        onChange: handlerChange,
      };
      const triggerType = getTriggerType(rules) as 'onChange';
      if (field && triggerType) {
        const fn = propsData[triggerType];
        propsData[triggerType] = (...args: any[]) => {
          fn?.(...args);
          contextData.validate([field]);
        };
      }
      if (React.isValidElement<any>(child)) {
        child = React.cloneElement(child, {
          ...child.props,
          ...propsData,
          children: child.props.children ?? content,
        });
      } else if (child.isReactClass) {
        const Comp = child;
        return <Comp {...propsData} />;
      } else if (typeof child === 'function') {
        child = child(propsData);
      } else if (typeof child === 'string' && components[child]) {
        const Comp = components[child];
        return <Comp {...propsData} />;
      }
      return child;
    }
    return itemInstance.current.value;
  };
  const getClassName = () => {
    const str: string[] = ['wxl-form-item'];
    const _span = span ?? contextData.span;
    const _offset = offset ?? contextData.offset;
    const topClass = textAlign === 'top' ? 'wxl-form-item-top' : '';
    const errorClass = itemInstance.current.errorMsg ? 'item_error' : '';
    if (_span) {
      str.push(`col-${_span}`);
    }
    if (_offset) {
      str.push(`col-offset-${_offset}`);
    }
    const arr = ['xs', 'sm', 'md', 'lg', 'xl'];
    arr.forEach((key) => {
      const o = props[key as 'xs'] ?? contextData[key as 'xs'];
      if (!o) return '';
      if (typeof o === 'object') {
        if (o.span) {
          str.push(`col-${key}-${o.span}`);
        }
        if (o.offset) {
          str.push(`col-${key}-offset-${o.offset}`);
        }
      } else {
        str.push(`col-${key}-${o}`);
      }
    });
    if (topClass) {
      str.push(topClass);
    }
    if (errorClass) {
      str.push(errorClass);
    }
    if (itemClassName) {
      str.push(itemClassName);
    }
    return str.join(' ');
  };
  return (
    <div
      className={getClassName()}
      data-field={field}
      style={{
        minWidth: minItemWidth ?? contextData.minItemWidth,
        ...itemStyle,
        display: itemInstance.current.show ? undefined : 'none',
      }}
    >
      {label !== undefined && (
        <label
          title={typeof label === 'string' ? label : ''}
          className={`wxl-form-item-label ${isRequired ? 'required' : ''}`}
          style={labelStyles}
        >
          {label}
        </label>
      )}
      <div className="wxl-form-item-container">
        <div className="wxl-form-item-children">
          <div className="wxl-form-item-com">{getChildren()}</div>
          {rightInfo && (
            <div className="wxl-form-item-rightInfo">{rightInfo}</div>
          )}
        </div>
        {itemInstance.current.errorMsg && (
          <span className="wxl-form-item-error">
            {itemInstance.current.errorMsg}
          </span>
        )}
        {bottomInfo && <>{bottomInfo}</>}
      </div>
    </div>
  );
};
export default React.memo(FormItem);
