import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import type { TableListItem, TableListPagination } from './data.d';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ItemListProxy from '@/services/proxy/items/get-items';
import CreateItemProxy from '@/services/proxy/items/create-item';
import { ProxyStatusEnum } from '@/types/http/proxy/ProxyStatus';
import { useIntl } from 'umi';
import DeleteItemProxy from '@/services/proxy/items/delete-item';
import GetItemProxy from '@/services/proxy/items/get-item';
import Modal from 'antd/lib/modal/Modal';

const TableList: React.FC = () => {
  const [itemList, setItemList] = useState<TableListItem[]>([]);
  //  Cửa sổ bật lên mới
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  //  Cửa sổ cập nhật phân phối bật lên

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const [isModel, setIsModel] = useState<string>("");

  const intl = useIntl();

  const handleCreate = (data: string) => {
    CreateItemProxy({
      name: data,
      modelPath: isModel ? isModel : "",
    })
      .then((res) => {
        console.log(res)
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultLoginFailureMessage = intl.formatMessage({
            id: 'pages.login.failure',
            defaultMessage: res.message ?? 'create item fail',
          });
          message.error(defaultLoginFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultLoginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: 'Success!',
          });
          message.success(defaultLoginSuccessMessage);
        }
      })
      .catch((err) => {
        const defaultLoginFailureMessage = intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: err.message ?? 'create item fail',
        });
        message.error(defaultLoginFailureMessage);
      })
      .finally(() => { });
  };

  const deleteItem = (id: number) => {
    DeleteItemProxy({
      id: id
    })
      .then((res) => {
        console.log(res)
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultLoginFailureMessage = intl.formatMessage({
            id: 'pages.login.failure',
            defaultMessage: res.message ?? 'delete item fail',
          });
          message.error(defaultLoginFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultLoginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: 'Success!',
          });
          message.success(defaultLoginSuccessMessage);
        }
      })
      .catch((err) => {
        const defaultLoginFailureMessage = intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: err.message ?? 'delete item fail',
        });
        message.error(defaultLoginFailureMessage);
      })
      .finally(() => { });
  };

  const GetItem = (id: number) => {
    GetItemProxy({
      id: id
    })
      .then((res) => {
        console.log(res)
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultLoginFailureMessage = intl.formatMessage({
            id: 'pages.login.failure',
            defaultMessage: res.message ?? 'get item fail',
          });
          message.error(defaultLoginFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultLoginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: 'Success!',
          });
          message.success(defaultLoginSuccessMessage);
        }
      })
      .catch((err) => {
        const defaultLoginFailureMessage = intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: err.message ?? 'get item fail',
        });
        message.error(defaultLoginFailureMessage);
      })
      .finally(() => { });
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Name Model',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Link model',
      dataIndex: 'modelPath',
      renderText: (text: string) => <a href={text}>{text}</a>,
    },
    {
      title: 'Date',
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '2') {
          return <Input {...rest} placeholder="" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: 'Option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="view"
          onClick={() => {
            setShowDetail(true);
            setCurrentRow(record);
          }}
        >
          Detail
        </a>,
      ],
    },
  ];

  const handleModelChange = (info: any) => {
    console.log(info.file);
    if (info.file.status === "uploading") {
      return
    }
    if (info.file.status === "done") {
      if (info.file.response.code===200){
          // setIsModel(info.file.response.data.url);
        
          return message.success('Success');
      }
      return message.error('Failed');
    }
    if (info.file.status === "error") {
      return message.error('Failed');
    }
  };

  useEffect(() => {
    ItemListProxy()
      .then((res) => {
        console.log(res);
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultLoginFailureMessage = intl.formatMessage({
            id: 'pages.login.failure',
            defaultMessage: res.message ?? 'get items fail',
          });
          message.error(defaultLoginFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultLoginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: 'Success!',
          });
          setItemList(res?.data?.data?.items ?? []);
          message.success(defaultLoginSuccessMessage);
        }
      })
      .catch((err) => {
        const defaultLoginFailureMessage = intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: err ?? 'get items fail',
        });
        message.error(defaultLoginFailureMessage);
      });
  }, [intl]);

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="Model Table"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> Create
          </Button>,
        ]}
        dataSource={itemList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
            console.log(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <span>
                Are you sure want to delete this model?

              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              selectedRowsState.map((item) => {
                deleteItem(item.id);
              })
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Yes
          </Button>
          <Button type="primary">No</Button>
        </FooterToolbar>
      )}
      <ModalForm
        title="Create model"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          handleCreate(value.name);
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
        <Upload
          name="model"
          accept=".glb"
          showUploadList={false}
          action="https://api.vispace.tech/api/v1/uploads/model"
          onChange={handleModelChange}
          headers={{ Authorization: `Bearer ${localStorage.getItem("access_token")}` }}
        >
          <Button icon={<UploadOutlined />}>Click to upload model</Button>
        </Upload>
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          console.log(value);
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;