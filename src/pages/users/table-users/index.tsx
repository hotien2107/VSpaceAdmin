import BlockUserProxy from '@/services/proxy/users/block';
import UserListProxy from '@/services/proxy/users/get-users';
import UnblockUserProxy from '@/services/proxy/users/unblock';
import { ProxyStatusEnum } from '@/types/http/proxy/ProxyStatus';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Input, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
import type { TableUsersItem, TableUsersPagination } from './data';

const TableUsers: React.FC = () => {
  const [userList, setUserList] = useState<TableUsersItem[]>([]);
  //  Cửa sổ bật lên mới
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  //  Cửa sổ cập nhật phân phối bật lên

  const [countGetUserList, setCountGetUserList] = useState<number>(0);

  const [blockModalVisible, handleBlockModalVisible] = useState<boolean>(false);
  const [unblockModalVisible, handleUnblockModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableUsersItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableUsersItem[]>([]);

  const intl = useIntl();

  useEffect(() => {
    UserListProxy()
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error('Lỗi không lấy được danh sách người dùng');
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          setUserList(res?.data?.userList ?? []);
        }
      })
      .catch((err) => {
        message.error('Lỗi không lấy được danh sách người dùng', err);
      });
  }, [intl, countGetUserList]);

  const handleBlockUser = (id: number) => {
    BlockUserProxy(id).then((res) => {
      if (res.status === ProxyStatusEnum.FAIL) {
        message.error('Block user failed');
        return;
      }

      if (res.status === ProxyStatusEnum.SUCCESS) {
        message.success('Block user success');
        setCountGetUserList(countGetUserList + 1);
      }
    });
  };

  const handleUnblockUser = (id: number) => {
    UnblockUserProxy(id).then((res) => {
      if (res.status === ProxyStatusEnum.FAIL) {
        message.error('Unblock user failed');
        return;
      }

      if (res.status === ProxyStatusEnum.SUCCESS) {
        message.success('Unblock user success');
        setCountGetUserList(countGetUserList + 1);
      }
    });
  };

  const columns: ProColumns<TableUsersItem>[] = [
    {
      title: 'Tên người dùng',
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
      title: 'email',
      dataIndex: 'email',
      sorter: true,
      renderText: (val: string) => `${val}`,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) => {
        return val ? `${val}` : 'Không có';
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Đã kích hoạt',
          status: 'active',
        },
        1: {
          text: 'Chưa kích hoạt',
          status: 'inactive',
        },
        2: {
          text: 'Chặn',
          status: 'blocked',
        },
      },
    },
    {
      title: 'Thời gian giam gia',
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '2') {
          return <Input {...rest} placeholder="Vui lòng nhập lý do chặn!" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: 'Loại đăng nhập',
      sorter: true,
      dataIndex: 'provider',
      renderText: (val: string) => `${val}`,
    },
    {
      title: 'Tuỳ chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        if (record.status === 'blocked') {
          return [
            <a
              key="config"
              onClick={() => {
                handleUnblockModalVisible(true);
                setCurrentRow(record);
              }}
            >
              Unblock
            </a>,
          ];
        }
        return [
          <a
            key="config"
            onClick={() => {
              handleBlockModalVisible(true);
              setCurrentRow(record);
            }}
          >
            Block
          </a>,
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableUsersItem, TableUsersPagination>
        headerTitle="Mẫu yêu cầu"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        dataSource={userList}
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
              Đã chọn{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              Mục &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Xóa hàng loạt
          </Button>
          <Button type="primary">Phê duyệt hàng loạt</Button>
        </FooterToolbar>
      )}
      <ModalForm
        title="Người dùng mới"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          console.log(value);
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: 'Tên người dùng là bắt buộc',
            },
          ]}
          width="md"
          name="name"
        />
      </ModalForm>

      <Modal
        title="Basic Modal"
        visible={blockModalVisible}
        onOk={() => {
          handleBlockModalVisible(false);
          if (currentRow) {
            handleBlockUser(currentRow?.id);
          }
        }}
        onCancel={() => {
          handleBlockModalVisible(false);
        }}
      >
        <p>Bạn có muốn block người dùng này không?</p>
      </Modal>

      <Modal
        title="Basic Modal"
        visible={unblockModalVisible}
        onOk={() => {
          handleUnblockModalVisible(false);
          if (currentRow) {
            handleUnblockUser(currentRow?.id);
          }
        }}
        onCancel={() => {
          handleUnblockModalVisible(false);
        }}
      >
        <p>Bạn có muốn unblock người dùng này không?</p>
      </Modal>

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
          <ProDescriptions<TableUsersItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableUsersItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableUsers;
