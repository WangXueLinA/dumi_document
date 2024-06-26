/* eslint-disable @typescript-eslint/ban-types */
import { UnwrapNestedRefs, reactive, toRaw } from '@vue/reactivity';
import Schema from 'async-validator';
import { cloneDeep, get, has, set } from 'lodash';

import {
  EventArg,
  EventItem,
  FormItemInstance,
  FormItemInstances,
  SubCallback,
  ValidateParams,
} from './interface';
import { WatchOptions, WatchStopHandle, watch } from './watch';

type Options<T> = {
  submitShow?: boolean;
  scrollToError?: boolean;
  onChange?: (arg: EventArg<T>) => void;
};
export default class Store<T extends Object = {}> {
  private options: Options<T> = {
    submitShow: true,
  };

  formData!: UnwrapNestedRefs<T>;

  private originFormData!: T;

  private watchList: Array<
    EventItem & { unWatch: WatchStopHandle; options?: WatchOptions }
  > = [];

  itemInstances: FormItemInstances = {};

  constructor(defaultData: T = {} as T) {
    this.setValues(defaultData);
  }

  destroy = () => {
    this.watchList.forEach((obj) => obj.unWatch());
    this.watchList = [];
  };

  setOptions = (options: Options<T>) => {
    Object.assign(this.options, options);
  };

  private getItemInstance = (field: string) => {
    return this.itemInstances[field]?.find((obj) => obj.show);
  };

  subscribe = <J>(
    fields: string[],
    callback: SubCallback<J, T>,
    options?: WatchOptions,
  ) => {
    const unWatch = watch(
      fields.length
        ? fields.map((key) => () => get(this.formData, key))
        : [() => this.formData],
      (nv, ov) => {
        const list = nv.map((obj) => {
          if (Array.isArray(obj)) {
            return [...obj];
          }
          if (typeof obj === 'object' && obj) {
            return { ...obj };
          }
          return obj;
        });
        callback(fields[0], {
          value: list[0],
          oldVal: ov[0],
          row: this.rowData(),
          newValueList: list,
          oldValueList: ov,
        });
      },
      {
        flush: 'sync',
        immediate: true,
        ...options,
      },
    );
    const watchInfo = { fields, callback, unWatch, options };
    this.watchList.push(watchInfo);
    return () => {
      this.watchList = this.watchList.filter((item) => item !== watchInfo);
      unWatch();
    };
  };

  getFields = (fields?: string[]) => {
    return fields ?? Object.keys(this.itemInstances);
  };

  clearValidate = (params?: string[]) => {
    const fields = this.getFields(params);
    fields.forEach((field) => {
      const obj = this.getItemInstance(field);
      if (obj && obj.errorMsg) {
        obj.setErrorMsg();
      }
    });
  };

  // eslint-disable-next-line class-methods-use-this
  bootstrap = (field: string, value: any) => {
    this.watchList.forEach((obj) => {
      if (obj.fields.includes(field)) {
        obj.callback(field, { value, row: this.rowData() });
      }
    });
  };

  rowData = () => toRaw(this.formData) as T;

  getValue = (field: string) => get(this.rowData(), field);

  getValues = (isShow = false) => {
    if (isShow) {
      const fields = this.getFields().filter((field) => {
        return this.itemInstances[field]?.some((obj) => obj?.show);
      });
      const data = {} as T;
      fields.forEach((k) => {
        set(data, k, this.getValue(k));
      });
      return data;
    }

    return this.rowData();
  };

  setValue = (field: string, value: any, validate = true) => {
    set(
      this.formData,
      field,
      typeof value === 'object' && value ? cloneDeep(value) : value,
    );
    if (validate) {
      this.validate([field]);
    }
  };

  setValues = (data: T = {} as T) => {
    this.originFormData = cloneDeep(data);
    Object.entries(this.itemInstances).forEach(([field, list]) => {
      const item = list.find((obj) => obj.show);
      if (!has(data, field) && item?.defaultValue !== undefined) {
        set(data, field, item?.defaultValue);
      }
    });

    this.formData = reactive<T>(cloneDeep(data));
    const list = [...this.watchList];
    this.watchList = [];
    list.forEach((obj) => {
      obj.unWatch();
      this.subscribe(obj.fields, obj.callback, obj.options);
    });
    this.clearValidate();
  };

  validate = <P extends string[]>(params?: P) => {
    const fields = this.getFields(params).filter((field) => {
      return this.itemInstances[field]?.some(
        (obj) => obj && (this.options.submitShow ? obj.show : true),
      );
    });
    const data = {} as P extends string[] ? any : T;
    fields.forEach((k) => {
      set(data, k, this.getValue(k));
    });
    if (!fields.length) return Promise.resolve(data);
    const validateParams: ValidateParams = fields.reduce(
      ({ rule, source }: ValidateParams, field) => {
        const obj = this.getItemInstance(field);
        if (obj && obj.rules) {
          rule[field] = obj.rules;
          source[field] = this.getValue(field);
        }
        return { rule, source };
      },
      { rule: {}, source: {} },
    );
    if (!Object.keys(validateParams.rule).length) {
      return Promise.resolve(data);
    }
    return new Schema(validateParams.rule)
      .validate(validateParams.source)
      .then(() => {
        this.clearValidate(fields);
        return data;
      })
      .catch((err) => {
        const { errors = [] } = err;
        let isScroll = false;
        errors.forEach((obj: any) => {
          const item = this.getItemInstance(obj.field);
          item?.setErrorMsg(obj.message);
          if (!isScroll) {
            const dom = document.querySelector(`[data-field='${obj.field}']`);
            if (dom && this.options.scrollToError !== false) {
              isScroll = true;
              dom?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start',
              });
            }
          }
        });
        return Promise.reject(err);
      });
  };

  resetFields = (data?: T) => {
    this.setValues(data ?? this.originFormData);
  };

  resetField = (field: string, value?: any, validate?: boolean) => {
    const val = value ?? get(this.originFormData, field);
    this.setValue(field, val, validate ?? false);
  };

  onFiledChange = (field: string, options: any) => {
    this.setValue(field, options.value);
    this.options.onChange?.({
      field,
      value: options.value,
      e: options.e,
      formData: this.rowData(),
    });
  };

  onLifeCycle = (field: string, comp: FormItemInstance) => {
    if (Array.isArray(this.itemInstances[field])) {
      this.itemInstances[field].push(comp);
    } else {
      this.itemInstances[field] = [comp];
    }
    if (this.getValue(field) === undefined && comp.value !== undefined) {
      this.setValue(field, comp.value, false);
    }
    return () => {
      this.itemInstances[field] = this.itemInstances[field]?.filter(
        (o) => o !== comp,
      );

      if (!this.itemInstances[field]?.length) {
        delete this.itemInstances[field];
      }
    };
  };
}
