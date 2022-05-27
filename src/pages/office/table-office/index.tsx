import { message, Input, Drawer, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { TableListItem, TableListPagination, OfficeDetail } from './data.d';
import { ProxyStatusEnum } from '@/types/http/proxy/ProxyStatus';
import { useIntl } from "umi";
import GetOfficeListProxy from '@/services/proxy/offices/office-list';
import OfficeDetailProxy from '@/services/proxy/offices/office-detail';
import BlockOfficeProxy from '@/services/proxy/offices/block-office';
import UnblockOfficeProxy from '@/services/proxy/offices/upblock-office';

const OfficeTable: React.FC = () => {
  const [itemList, setItemList] = useState<TableListItem[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pagination, setPagination] = useState<TableListPagination>({
    total: 0,
    pageSize: 0,
    current: 1,
    name:"",
  });
  const [blockModalVisible, handleBlockModalVisible] = useState<boolean>(false);
  const [unblockModalVisible, handleUnblockModalVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [currentOffice, setCurrentOffice] = useState<OfficeDetail>();
  const [countHanlde, setCountHandle] = useState<number>(0);

  const [name, setName] = useState<string>("");
  const [sorter, setSorter] = useState<string>("");
  const intl = useIntl();

  const columns: ProColumns<TableListItem>[] = [
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
              GetOffice(entity.id)
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
      renderText: (text: string) => <p>{text}</p>,
    },
    {
      hideInSearch:true,
      title: 'Created At',
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
          key="block"
          onClick={() => {
            handleBlockModalVisible(true);
            setCurrentRow(record);
          }}
        >
          Block
        </a>,
         <a
         key="unblock"
         onClick={() => {
           handleUnblockModalVisible(true);
           setCurrentRow(record);
         }}
       >
         Unblock
       </a>,
      ],
    },
  ];

  const columnDetail: ProColumns<OfficeDetail>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Invitation Code',
      hideInSearch:true,
      dataIndex: 'invitationCode',
      renderText: (text: string) => <p>{text}</p>,
    },
    {
      title: 'Date',
      hideInSearch:true,
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
      hideInSearch:true,
      valueType: 'option',
    },
  ];

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

  const handleBlockOffice = (id: number) => {
    BlockOfficeProxy(id).then((res) => {
      if (res.status === ProxyStatusEnum.FAIL) {
        message.error('Block Office failed');
        return;
      }

      if (res.status === ProxyStatusEnum.SUCCESS) {
        message.success('Block Office success');
        setCountHandle(countHanlde + 1);
      }
    });
  };

  const handleUnblockOffice = (id: number) => {
    UnblockOfficeProxy(id).then((res) => {
      if (res.status === ProxyStatusEnum.FAIL) {
        message.error('Unblock Office failed');
        return;
      }

      if (res.status === ProxyStatusEnum.SUCCESS) {
        message.success('Unblock Office success');
        setCountHandle(countHanlde + 1);
      }
    });
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
        dataSource={itemList}
        columns={columns}
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
      <Modal
        title="Basic Modal"
        visible={blockModalVisible}
        onOk={() => {
          handleBlockModalVisible(false);
          if (currentRow) {
            handleBlockOffice(currentRow?.id)
          }
        }}
        onCancel={() => {
          handleBlockModalVisible(false);
        }}
      >
        <p>Do you want to block this office?</p>
      </Modal>
      <Modal
        title="Unblock user"
        visible={unblockModalVisible}
        onOk={() => {
          handleUnblockModalVisible(false);
          if (currentRow) {
            handleUnblockOffice(currentRow?.id);
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