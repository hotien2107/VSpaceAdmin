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
  const [userPagination, setUserPagination] = useState<TableUsersPagination>({
    total: 0,
    pageSize: 0,
    current: 1,
    name:"",
    email:"",
    status:"",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
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
  const [pageSize, setPageSize] = useState<number>(10);
  const [name, setName] = useState<string>("");
  const [email, setEmail] =useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [sorter, setSorter] = useState<string>("");


  const intl = useIntl();

  useEffect(() => {
    let tmp:Object={ 
      page: currentPage, 
      limit: pageSize,
      "name[startsWith]": name, 
      "email[contains]":email,
      sort_by:sorter,
    };

    if (status!==""){
      tmp={ 
        page: currentPage, 
        limit: pageSize,
        "name[startsWith]": name, 
        "email[contains]":email,
        status: status,
        sort_by:sorter
      };
    }
    console.log(tmp);
    UserListProxy(tmp)
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error('Lỗi không lấy được danh sách người dùng');
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          setUserList(res?.data?.userList ?? []);

          if (res?.data?.pagination) {
            setUserPagination({
              total: res?.data?.pagination?.totalCount ?? 0,
              pageSize: res?.data?.pagination?.count ?? 0,
              current: res?.data?.pagination?.page ?? 1,
              email:"",
              name:"",
              status:""
            });
          }
        }
      })
      .catch((err) => {
        message.error('Lỗi không lấy được danh sách người dùng', err);
      });
  }, [intl, countGetUserList, currentPage, pageSize,name,email,sorter,status]);

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
      sorter: {
        multiple: 1,
      },
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
      renderText: (val: string) => `${val}`,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
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
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: {
        multiple: 2,
      },
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
        headerTitle="Danh sách người dùng"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={(params, sorter) => {
          setName(params?.name);
          setEmail(params?.email);
          console.log(params);
          let statusSearch:string="";
          switch (params?.status){
            case "0":
              statusSearch="inactive";
              break;
            case "1":
              statusSearch="active";
              break;
            case "2":
              statusSearch="blocked";
              break;
            default:
              statusSearch="";
          }
          setStatus(statusSearch);
          let nameSorter:string="";
          nameSorter= sorter.name && sorter.name ==="ascend"?"name":"-name";
          let createAtSorter:string="";
          createAtSorter= sorter.createAt && sorter.createAt ==="ascend"?"create_at":"-create_at";
          setSorter(nameSorter+","+createAtSorter);
          return Promise.resolve({
            success: true,
          });
        }}
        dataSource={userList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
            console.log(selectedRows);
          },
        }}
        pagination={{
          pageSize: pageSize,
          total: userPagination.total,
          current: userPagination.current,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          onShowSizeChange: (page, pageSize) => {
            console.log(pageSize);
            setPageSize(pageSize);
          },
          onChange: (page) => {
            setCurrentPage(page);
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
