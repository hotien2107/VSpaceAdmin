import BlockUserProxy from '@/services/proxy/users/block';
import UserListProxy from '@/services/proxy/users/get-users';
import UnblockUserProxy from '@/services/proxy/users/unblock';
import { ProxyStatusEnum } from '@/types/http/proxy/ProxyStatus';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Drawer, Input, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
import type { TableUsersItem, TableUsersPagination } from './data';

const TableUsers: React.FC = () => {
  const [userList, setUserList] = useState<TableUsersItem[]>([]);
  const [userPagination, setUserPagination] = useState<TableUsersPagination>({
    total: 0,
    pageSize: 0,
    current: 1,
    name: "",
    email: "",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [countGetUserList, setCountGetUserList] = useState<number>(0);

  const [blockModalVisible, handleBlockModalVisible] = useState<boolean>(false);
  const [unblockModalVisible, handleUnblockModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableUsersItem>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [sorter, setSorter] = useState<string>("");


  const intl = useIntl();

  useEffect(() => {
    let tmp: Object = {
      page: currentPage,
      limit: pageSize,
      "name[startsWith]": name,
      "email[contains]": email,
      sort_by: sorter,
    };

    if (status !== "") {
      tmp = {
        page: currentPage,
        limit: pageSize,
        "name[startsWith]": name,
        "email[contains]": email,
        status: status,
        sort_by: sorter
      };
    }
    UserListProxy(tmp)
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error('Do not load user list');
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          setUserList(res?.data?.userList ?? []);

          if (res?.data?.pagination) {
            setUserPagination({
              total: res?.data?.pagination?.totalCount ?? 0,
              pageSize: res?.data?.pagination?.count ?? 0,
              current: res?.data?.pagination?.page ?? 1,
              email: "",
              name: "",
            });
          }
        }
      })
      .catch((err) => {
        message.error('Do not load user list', err);
      });
  }, [intl, countGetUserList, currentPage, pageSize, name, email, sorter, status]);

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
      title: 'ID',
      dataIndex: 'id',
      hideInSearch:true,
    },
    {
      title: 'Name',
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
      title: 'Email',
      dataIndex: 'email',
      renderText: (val: string) => `${val}`,
    },
    {
      hideInSearch: true,
      title: 'Phone Number',
      dataIndex: 'phone',
      renderText: (val: string) => {
        return val ? `${val}` : 'None';
      },
    },
    {
      hideInSearch: true,
      title: 'Status',
      dataIndex: 'status',
      filters: [
        {
          text: 'Active',
          value: 'active',
        },
        {
          text: 'Inactive',
          value: 'inactive',
        },
        {
          text: 'Blocked',
          value: 'blocked',
        },
      ],
      valueEnum: {
        0: {
          text: 'Active',
          status: 'active',
        },
        1: {
          text: 'Inactive',
          status: 'inactive',
        },
        2: {
          text: 'Blocked',
          status: 'blocked',
        },
      },
    },
    {
      hideInSearch: true,
      title: 'Create At',
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
      hideInSearch: true,
      title: 'Provider',
      dataIndex: 'provider',
      renderText: (val: string) => `${val}`,
    },
    {
      hideInSearch: true,
      title: 'Option',
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

  const handleFilter = (filter: any) => {
    let statusFilter: string = "";
    filter?.status?.map((item: any) => {
      statusFilter += item.toString() + ',';
    })
    if (statusFilter.length > 1) {
      statusFilter = statusFilter.substring(0, statusFilter.length - 1)
    }
    setStatus(statusFilter);
  }

  const customField = (key: string) => {
    let tmp: string="";
    switch (key) {
      case "createdAt":
        tmp = "created_at";
        break;
      default:
        tmp=key;
        break;
    }
    return tmp;
  }

  const handleSorter = (sorter: any) => {
    let key: any;
    let sorterTmp: string = "";
    for (key in sorter) {
      let element: string = sorter[key] == "ascend" ? customField(key) : "-" + customField(key);
      sorterTmp += element + ","
    }
    if (sorterTmp.length > 0) {
      sorterTmp = sorterTmp.substring(0, sorterTmp.length - 1)
    }
    setSorter(sorterTmp);
  }

  return (
    <PageContainer>
      <ProTable<TableUsersItem, TableUsersPagination>
        headerTitle="User List"
        cardBordered
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={(params, sorter, filter) => {
          setName(params?.name);
          setEmail(params?.email);

          handleFilter(filter);

          handleSorter(sorter);

          return Promise.resolve({
            success: true,
          });
        }}
        dataSource={userList}
        columns={columns}
        pagination={{
          pageSize: pageSize,
          total: userPagination.total,
          current: userPagination.current,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50", "100"],
          onShowSizeChange: (page, pageSize) => {
            setPageSize(pageSize);
          },
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
      />
      <Modal
        title="Block user"
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
        <p>Do you want to block this user?</p>
      </Modal>

      <Modal
        title="Unblock user"
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
        <p>Do you want to unblock this user?</p>
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
