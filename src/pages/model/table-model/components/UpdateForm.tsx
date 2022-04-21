import React from 'react';
import { Modal } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import type { TableListItem } from '../type';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<TableListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{
              padding: '32px 40px 48px',
            }}
            destroyOnClose
            title="Update"
            visible={props.updateModalVisible}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          name: props.values.name,
        }}
        title="search"
      >
        <ProFormText
          name="name"
          label="hi"
          width="md"
          rules={[
            {
              required: true,
              message: 'hi',
            },
          ]}
        />
        <ProFormTextArea
          name="desc"
          width="md"
          label="hi"
          placeholder="hi"
          rules={[
            {
              required: true,
              message: 'hi',
              min: 5,
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          target: '0',
          template: '0',
        }}
        title="hi"
      >
        <ProFormSelect
          name="target"
          width="md"
          label="hi"
          valueEnum={{
            0: 'hi',
            1: 'i',
          }}
        />
        <ProFormSelect
          name="template"
          width="md"
          label="规则模板"
          valueEnum={{
            0: '规则模板一',
            1: '规则模板二',
          }}
        />
        <ProFormRadio.Group
          name="type"
          label="规则类型"
          options={[
            {
              value: '0',
              label: '强',
            },
            {
              value: '1',
              label: '弱',
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          type: '1',
          frequency: 'month',
        }}
        title="设定调度周期"
      >
        <ProFormDateTimePicker
          name="time"
          width="md"
          label="开始时间"
          rules={[
            {
              required: true,
              message: '请选择开始时间！',
            },
          ]}
        />
        <ProFormSelect
          name="frequency"
          label="监控对象"
          width="md"
          valueEnum={{
            month: '月',
            week: '周',
          }}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;