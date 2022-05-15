import React, { useState, useEffect } from 'react';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { InputForm } from "../data";
import { CategoryInterface } from '@/types/item';



type UpdateFormProps = {
  modalVisible: boolean;
  handleModalVisible: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  onSubmit:(id:number, values:InputForm,)=>void;
  currentItem: CategoryInterface;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { modalVisible, onSubmit, handleModalVisible, currentItem } = props;

  return (
    <ModalForm
    title="Update Item Category"
    width="400px"
    visible={modalVisible}
    onVisibleChange={handleModalVisible}
    onFinish={async (value) => {
      const category:InputForm={
        name: value.name,
        description: value.description,
      }
      console.log(value);
      onSubmit(currentItem?.id, category);
      handleModalVisible(false);
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
      initialValue={currentItem?.name}
      label="Name Category"
    />
    <ProFormTextArea
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
      initialValue={currentItem?.description}
      label="Description Category"
    />
  </ModalForm>
  );
};

export default UpdateForm;