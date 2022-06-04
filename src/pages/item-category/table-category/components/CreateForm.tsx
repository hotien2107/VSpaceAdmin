import React, {useEffect} from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { InputForm } from "../data";
import {Form} from "antd"



type CreateFormProps = {
  modalVisible: boolean;
  handleModalVisible: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  onSubmit:(values:InputForm)=>void;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit, handleModalVisible } = props;

  useEffect(()=>{
    form.resetFields();
  },[modalVisible])
  
  return (
    <ModalForm
    title="Create Category"
    width="400px"
    form={form}
    visible={modalVisible}
    onVisibleChange={handleModalVisible}
    onFinish={async (value) => {
      const category:InputForm={
        name: value.name.trim()==""?"":value.name,
        description: value.description.trim() == ""?"":value.description,
      }
      onSubmit(category);
    }}
  >
      <ProFormText
          rules={[
            {
              required: true,
              message: 'Name is required',
            },
          ]}
          width="md"
          name="name"
          placeholder="Enter name..."
          label="Category Name"
          initialValue=""
        />
        <ProFormText
           rules={[
            {
              required: true,
              message: 'Description is required',
            },
            {
              max:255,
              message: 'Description must be less 255 charactor',
            }
          ]}
          width="md"
          name="description"
          placeholder="Enter description..."
          label="Description"
          initialValue=""
        />
  </ModalForm>
  );
};

export default CreateForm;