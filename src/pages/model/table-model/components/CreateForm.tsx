import React, { useState, useEffect } from 'react';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { Button, message, Upload, Form } from 'antd';
import type { InputForm, SelectedInterface } from "../data";
import { UploadOutlined } from '@ant-design/icons';
import CategoryListProxy from '@/services/proxy/item-categories/get-item-categories';
import axios from 'axios';
import { ProxyStatusEnum } from '@/types/http/proxy/ProxyStatus';



type CreateFormProps = {
  modalVisible: boolean;
  handleModalVisible: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  onSubmit: (values: InputForm) => void;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onSubmit, handleModalVisible } = props;
  const [isModel, setIsModel] = useState<string>('');
  const [isImage, setIsImage] = useState<string>('');
  const [categoryList, setCategoryList] = useState<SelectedInterface[]>();
  const [form] = Form.useForm()

  useEffect(() => {
    CategoryListProxy({})
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error("Don't load category list");
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          let list: Array<SelectedInterface> = [];
          res?.data?.itemCategories.map((item) => {
            let tmp: SelectedInterface = {
              value: item.id.toString(),
              label: item.name,
            }
            list.push(tmp);
          })
          setCategoryList(list);
        }
      })
      .catch((err) => {
        message.error("Don't load category list");
      });
      form.resetFields();
  }, [])

  return (
    <ModalForm
      title="Create model"
      width="400px"
      form={form}
      visible={modalVisible}
      onVisibleChange={handleModalVisible}
      onFinish={async (value) => {
        onSubmit({
          name: value.name.trim()==""?"":value.name,
          categoryId: Number.parseInt(value.category),
          image: isImage,
          modelPath: isModel,
        });
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
        label="Name"
      />
      <ProFormSelect
        options={categoryList}
        width="md"
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please select your country!' }]}
      />
      <Upload
        style={{ marginBottom: "1rem" }}
        name="model"
        accept=".glb, .gltf"
        listType="picture"
        showUploadList={true}
        customRequest={(options) => {
          const { file } = options;
          const fmData = new FormData();
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'multipart/form-data',
            },
          };

          if (file instanceof Blob) {
            const fileConvert = new File([file], 'model', {
              type: file?.type !== '' ? file?.type : 'model/gltf-binary',
            });
            fmData.append('model', fileConvert);
          }
          try {
            axios
              .post('https://api.vispace.tech/api/v1/uploads/model', fmData, config)
              .then((res) => {
                if (res?.data?.code && res?.data?.code === 200) {
                  setIsModel(res?.data?.data?.url ?? '');
                  message.success('Upload model success!');
                  return;
                } else {
                  message.error('Upload model failed!');
                  return;
                }
              });
          } catch (err) {
          }
        }}
      >
        <Button style={{ marginBottom: "1rem" }}
          icon={<UploadOutlined />}>Click to upload model</Button>
      </Upload>
      <Upload
        name="img"
        listType="picture"
        showUploadList={true}
        // onChange={handleAvatarChange}
        customRequest={(options) => {
          const { file } = options;
          const fmData = new FormData();
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'multipart/form-data',
            },
          };

          fmData.append('image', file);
          try {
            axios
              .post('https://api.vispace.tech/api/v1/uploads/image', fmData, config)
              .then((res) => {
                if (res?.data?.code && res?.data?.code === 200) {
                  setIsImage(res?.data?.data?.url ?? isImage);
                  message.success('Upload image success!');
                  return;
                } else {
                  message.error('Upload image failed!');
                  return;
                }
              });
          } catch (err) {
          }
        }}
        accept=".png,.jpg,.jpeg"
      >
        <Button icon={<UploadOutlined />}>Click to upload image</Button>
      </Upload>
    </ModalForm>
  );
};

export default CreateForm;