import React from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { InputForm } from "../data";



type UpdateFormProps = {
  modalVisible: boolean;
  handleModalVisible: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  onSubmit:(values:InputForm)=>void;
};

const CreateForm: React.FC<UpdateFormProps> = (props) => {
  const { modalVisible, onSubmit, handleModalVisible } = props;

  return (
    <ModalForm
    title="Update Category"
    width="400px"
    visible={modalVisible}
    onVisibleChange={handleModalVisible}
    onFinish={async (value) => {
      const category:InputForm={
        name: value.name,
        description: value.description,
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
        />
  </ModalForm>
  );
};

export default CreateForm;