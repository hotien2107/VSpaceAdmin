import React, { useState, useEffect } from 'react';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { Button, message, Upload, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import ProfileAvatar from './avatar';
import { EditProfileFormValuesInterface } from '../data';
import { UserInterface } from '@/types/user';

type CreateFormProps = {
  modalVisible: boolean;
  handleModalVisible: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  onSubmit: (values: EditProfileFormValuesInterface) => void;
  userInfo: UserInterface;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onSubmit, handleModalVisible, userInfo } = props;
  const [isAvatar, setIsAvatar] = useState<string>(userInfo?.avatar??"");
  const [form] = Form.useForm()

  useEffect(() => {
      form.resetFields();
  }, [])

  return (
    <ModalForm
      title="Change profile"
      width="400px"
      form={form}
      visible={modalVisible}
      onVisibleChange={handleModalVisible}
      onFinish={async (value) => {
        onSubmit({
          name: value.name.trim()==""?"":value.name,
          phone: value.phone() == ""?"":value.name,
          avatar: isAvatar
        });
      }}
    >
       {/* <ProfileAvatar
              size={120}
              setIsAvatar={setIsAvatar}
              isAvatar={isAvatar}
            /> */}
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
        label="Name"
      />
            <ProFormText
        rules={[
          {
            required: true,
            message: 'Phone is required',
          },
          {
            required: true,
            message: 'Phone is required',
          },
        ]}
        width="md"
        name="phone"
        placeholder="Enter phone number..."
        label="Phone number"
      />
    </ModalForm>
  );
};

export default CreateForm;