import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { TableListItem, TableListPagination, OfficeDetail } from './data.d';
import { ProxyStatusEnum } from '@/types/http/proxy/ProxyStatus';
import { useIntl } from 'umi';
import CreateOfficeProxy from '@/services/proxy/offices/create-office';
import GetOfficeListProxy from '@/services/proxy/offices/office-list';
import UpdateOfficeProxy from '@/services/proxy/offices/update-office';
import OfficeDetailProxy from '@/services/proxy/offices/office-detail';

const OfficeTable: React.FC = () => {
  const [itemList, setItemList] = useState<TableListItem[]>([]);
  //  Cửa sổ bật lên mới
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  //  Cửa sổ cập nhật phân phối bật lên

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [currentOffice, setCurrentOffice] = useState<OfficeDetail>();
  const intl = useIntl();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Name Office',
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
      title: 'Create User',
      dataIndex: 'nameUser',
      renderText: (text: string) => <a>{text}</a>,
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
          key="config"
          onClick={() => {
            GetOffice(record.id);
            setShowDetail(true);
            setCurrentRow(record);
          }}
        >
          Detail
        </a>,
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          Update
        </a>,
        <a
          key="view"
          onClick={() => {
          }}
        >
          Block
        </a>,
      ],
    },
  ];

  const columnDetail: ProColumns<OfficeDetail>[] = [
    {
      title: 'Name Office',
      dataIndex: 'name',
    },
    {
      title: 'Invitation Code',
      dataIndex: 'invitationCode',
      renderText: (text: string) => <a>{text}</a>,
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
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          Update
        </a>,
        <a
          key="view"
          onClick={() => {
          }}
        >
          Block
        </a>,
      ],
    },
  ];


  const handleCreate = (data: string) => {
    CreateOfficeProxy({
      name: data,
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

  const UpdateOffice = (id: number, name: string) => {
    UpdateOfficeProxy({
      id: id,
      name: name,
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

  const GetOffice = (id: number) => {
    OfficeDetailProxy({
      id: id
    })
      .then((res) => {
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
          setCurrentOffice(res?.data.office);
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

  useEffect(() => {
    GetOfficeListProxy({ page: 1, size: 10 })
      .then((res) => {
        console.log(res.status);
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
          let list: Array<TableListItem> = [];
          res?.data?.officeList.map((item) => {
            let tmp: TableListItem = {
              id: item.id,
              name: item.name,
              nameUser: item.createdBy.name,
              createdAt: item.createdAt,
            }
            list.push(tmp);
          })
          setItemList(list);
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
        headerTitle="Office Table"
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
                // deleteItem(item.id);
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
          label="Name office"
        />
      </ModalForm>
      <ModalForm
        title="Update office"
        width="400px"
        visible={updateModalVisible}
        onVisibleChange={handleUpdateModalVisible}
        onFinish={async (value) => {
          UpdateOffice(currentRow?.id, value.name);
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
          initialValue={currentRow?.name}
          label="Name office"
        />
      </ModalForm>
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentOffice?.name && (
          <>
            <ProDescriptions<OfficeDetail>
              column={1}
              title={currentOffice?.name}
              request={async () => ({
                data: currentOffice || {},
              })}
              params={{
                id: currentOffice?.name,
              }}
              columns={columnDetail as ProDescriptionsItemProps<OfficeDetail>[]}
            />
            <p>Create By: {currentOffice.createdBy.name}</p>
            <p>Office Item:</p>
            <p>Office Member:</p>
            <table style={{ width: "100%" }}>
              <tr style={{ border: "1px solid black" }}>
                <th style={{ border: "1px solid black" }}>Name</th>
                <th style={{ border: "1px solid black" }}>Status</th>
                <th style={{ border: "1px solid black" }}>Position</th>
                <th style={{ border: "1px solid black" }}>Rotation</th>
              </tr>
              {currentOffice.officeMembers.map((item, index) => (
                <tr style={{ border: "1px solid black" }} key={index}>
                  <td style={{ border: "1px solid black", textAlign: "center" }}>{item.member.name}</td>
                  <td style={{ border: "1px solid black", textAlign: "center" }}>{item.onlineStatus}</td>
                  <td style={{ border: "1px solid black", textAlign: "center" }}>({item.transform.position.x}, {item.transform.position.y}, {item.transform.position.z})</td>
                  <td style={{ border: "1px solid black", textAlign: "center" }}>({item.transform.rotation.x}, {item.transform.rotation.y}, {item.transform.rotation.z})</td>
                </tr>
              ))}
            </table>
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default OfficeTable;