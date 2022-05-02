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
import { useIntl } from "umi";
import CreateOfficeProxy from '@/services/proxy/offices/create-office';
import GetOfficeListProxy from '@/services/proxy/offices/office-list';
import UpdateOfficeProxy from '@/services/proxy/offices/update-office';
import OfficeDetailProxy from '@/services/proxy/offices/office-detail';


const OfficeTable: React.FC = () => {
  const [itemList, setItemList] = useState<TableListItem[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pagination, setPagination] = useState<TableListPagination>({
    total: 0,
    pageSize: 0,
    current: 1,
    name:"",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [currentOffice, setCurrentOffice] = useState<OfficeDetail>();
  const [countHanlde, setCountHandle] = useState<number>(0);

  const [name, setName] = useState<string>("");
  const [sorter, setSorter] = useState<string>("");
  const intl = useIntl();

  const columns: ProColumns<TableListItem>[] = [
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
      title: 'Create by User',
      dataIndex: 'nameUser',
      renderText: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Date',
      sorter: {
        multiple: 2,
      },
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
          key="detail"
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
      title: 'Name',
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
          key="config1"
          onClick={() => {
            const tmp: TableListItem = {
              id: record.id,
              name: record.name,
              createdAt: record.createdAt,
              nameUser: record.createdBy.name
            }
            setCurrentRow(tmp);
            handleUpdateModalVisible(true);
          }}
        >
          Update
        </a>,
        <a
          key="view2"
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
          const defaultOfficeFailureMessage = intl.formatMessage({
            id: 'pages.create.fail',
            defaultMessage: res.message ?? 'create Office fail',
          });
          message.error(defaultOfficeFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultOfficeSuccessMessage = intl.formatMessage({
            id: 'pages.create.success',
            defaultMessage: 'Success!',
          });
          message.success(defaultOfficeSuccessMessage);
          handleModalVisible(false);
          setCountHandle(countHanlde + 1);
        }
      })
      .catch((err) => {
        const defaultOfficeFailureMessage = intl.formatMessage({
          id: 'pages.create.failure',
          defaultMessage: err.message ?? 'create Office fail',
        });
        message.error(defaultOfficeFailureMessage);
      })
      .finally(() => { });
  };

  const UpdateOffice = (id: number, name: string) => {
    UpdateOfficeProxy({
      id: id,
      name: name,
    })
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultOfficeFailureMessage = intl.formatMessage({
            id: 'pages.update.fail',
            defaultMessage: res.message ?? 'Update Office fail',
          });
          message.error(defaultOfficeFailureMessage);
          handleUpdateModalVisible(false);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultOfficeSuccessMessage = intl.formatMessage({
            id: 'pages.update.success',
            defaultMessage: 'Success!',
          });
          message.success(defaultOfficeSuccessMessage);
          setCountHandle(countHanlde + 1);
          GetOffice(id);
        }
      })
      .catch((err) => {
        const defaultOfficeFailureMessage = intl.formatMessage({
          id: 'pages.update.fail',
          defaultMessage: err.message ?? 'Update Office fail',
        });
        message.error(defaultOfficeFailureMessage);
      })
      .finally(() => { });
  };

  const GetOffice = (id: number) => {
    OfficeDetailProxy({
      id: id
    })
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultOfficeFailureMessage = intl.formatMessage({
            id: 'pages.detail.fail',
            defaultMessage: res.message ?? 'get detail office fail',
          });
          message.error(defaultOfficeFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultOfficeSuccessMessage = intl.formatMessage({
            id: 'pages.detail.success',
            defaultMessage: 'Success!',
          });
          setCurrentOffice(res?.data.office);
        }
      })
      .catch((err) => {
        const defaultOfficeFailureMessage = intl.formatMessage({
          id: 'pages.detail.fail',
          defaultMessage: err.message ?? 'get detail office fail',
        });
        message.error(defaultOfficeFailureMessage);
      })
      .finally(() => { });
  };

  useEffect(() => {
    GetOfficeListProxy({ page: currentPage, limit: pageSize, "name[startsWith]":name,sort_by:sorter })
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultOfficeFailureMessage = intl.formatMessage({
            id: 'pages.load.fails',
            defaultMessage: res.message ?? 'Load fail',
          });
          message.error(defaultOfficeFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultOfficeSuccessMessage = intl.formatMessage({
            id: 'pages.load.success',
            defaultMessage: 'Success!',
          });
          let list: Array<TableListItem> = [];
          res?.data?.offices.map((item) => {
            let tmp: TableListItem = {
              id: item.id,
              name: item.name,
              nameUser: item.createdBy.name,
              createdAt: item.createdAt,
            }
            list.push(tmp);
          })
          setItemList(list);
          if (res?.data?.pagination) {
            setPagination({
              total: res?.data?.pagination?.totalCount ?? 0,
              pageSize: res?.data?.pagination?.count ?? pageSize,
              current: res?.data?.pagination?.page ?? 1,
              name:"",
            });
          }
        }
      })
      .catch((err) => {
        const defaultOfficeFailureMessage = intl.formatMessage({
          id: 'pages.load.failure',
          defaultMessage: err ?? 'Load Office fail',
        });
        message.error(defaultOfficeFailureMessage);
      });
  }, [intl, countHanlde, currentPage, pageSize,name,sorter]);


  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="Office Table"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={(params, sorter) => {
          setName(params?.name);
          let nameSorter:string="";
          nameSorter= sorter.name && sorter.name ==="ascend"?"name":"-name";
          let createAtSorter:string="";
          createAtSorter= sorter.createAt && sorter.createAt ==="ascend"?"create_at":"-create_at";
          setSorter(nameSorter+","+createAtSorter);
          return Promise.resolve({
            success: true,
          });
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
          },
        }}
        pagination={{
          pageSize: pageSize,
          total: pagination.total,
          current: pagination.current,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20","50","100"],
          onShowSizeChange: (page, pageSize) => {
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
          if (currentRow?.id) {
            UpdateOffice(currentRow?.id, value.name);
          }
          else {
            const defaultOfficeFailureMessage = intl.formatMessage({
              id: 'pages.load.fails',
              defaultMessage: 'Load fail',
            });
            message.error(defaultOfficeFailureMessage);
          }
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