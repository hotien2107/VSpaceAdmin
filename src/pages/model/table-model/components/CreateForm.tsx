import React, { useState } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Button,message, Upload } from 'antd';
import type { InputForm } from "../data";
import {  UploadOutlined } from '@ant-design/icons';
import CategoryListProxy from '@/services/proxy/item-categories/get-item-categories';
import { Select } from 'antd';
const { Option } = Select;
import axios from 'axios';
import { CategoryInterface } from '@/types/item';
import { ProxyStatusEnum } from '@/types/http/proxy/ProxyStatus';



type CreateFormProps = {
  modalVisible: boolean;
  handleModalVisible: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  onSubmit:(values:InputForm)=>void;
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onSubmit, handleModalVisible } = props;
  const [isModel, setIsModel] = useState<string>('');
  const [isImage, setIsImage] = useState<string>('');
  const [isCategoryId, setIsCategoryId] = useState<number>(1);
  const [categoryList, setCategoryList] = useState<CategoryInterface[]>();



  const getCategoryList = () =>{
    CategoryListProxy({})
    .then((res) => {
      if (res.status === ProxyStatusEnum.FAIL) {
        message.error("Don't load category list");
        return;
      }

      if (res.status === ProxyStatusEnum.SUCCESS) {
        let list: Array<CategoryInterface> = [];
        res?.data?.itemCategories.map((item) => {
          let tmp: CategoryInterface = {
            id: item.id,
            name: item.name,
            description: item.description,
            createdAt: item.createdAt,
          }
          list.push(tmp);
        })
        console.log(list);
        setCategoryList(list);
      }
    })
    .catch((err) => {
      message.error("Don't load category list");
    });
  }

  return (
    <ModalForm
    title="Create model"
    width="400px"
    visible={modalVisible}
    onVisibleChange={handleModalVisible}
    onFinish={async (value) => {
      onSubmit({
        name: value.name,
        categoryId: isCategoryId,
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
      label="Name model"
    />

    <ProFormText
      width="md"
      name="model"
      label="Model Path"
      placeholder={isModel}
      className='custom-input-text'
      
    />

    <Upload
      name="model"
      accept=".glb, .gltf"
      showUploadList={false}
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
              } else {
                console.log('error', res);
                message.error('Upload model failed!');
              }
            });
        } catch (err) {
          console.log('Eroor: ', err);
        }
      }}
    >
      <Button icon={<UploadOutlined />}>Click to upload model</Button>
    </Upload>
    <ProFormText
      className='custom-input-text'
      width="md"
      name="image"
      placeholder={isImage}
      label="Image Link"
    />
    <Upload
      name="img"
      listType="picture"
      showUploadList={false}
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
              console.log(res);
              if (res?.data?.code && res?.data?.code === 200) {
                console.log(res?.data?.data?.url);
                setIsImage(res?.data?.data?.url ?? isImage);
                message.success('Upload image success!');
              } else {
                console.log('error', res);
                message.error('Upload image failed!');
              }
            });
        } catch (err) {
          console.log('Eroor: ', err);
        }
      }}
      accept=".png,.jpg,.jpeg"
    >
      <Button icon={<UploadOutlined />}>Click to upload image</Button>
    </Upload>
    <Select 
      style={{ width: 240, marginTop: "1rem", display: "block" }} 
      onChange={(value) => setIsCategoryId(Number.parseInt(value))}
      onDropdownVisibleChange={getCategoryList} >
      {categoryList && categoryList.map((category)=>(
        <Option key={category.id.toString()}>{category.name}</Option>
      ))

      }
    </Select>
  </ModalForm>
  );
};

export default CreateForm;