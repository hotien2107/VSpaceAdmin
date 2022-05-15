import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { TableListItem, TableListPagination, InputForm } from './data';
import { ProxyStatusEnum } from '@/types/http/proxy/ProxyStatus';
import { useIntl } from "umi";
import CreateCategoryProxy from '@/services/proxy/item-categories/create-item-category';
import GetCategoryProxy from '@/services/proxy/item-categories/get-item-category';
import CategoryListProxy from '@/services/proxy/item-categories/get-item-categories';
import UpdateCategoryProxy from '@/services/proxy/item-categories/update-item-category';
import { ItemCategoryInterface } from '@/types/item-category';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

const CategoryTable: React.FC = () => {
  const [itemList, setItemList] = useState<TableListItem[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pagination, setPagination] = useState<TableListPagination>({
    total: 0,
    pageSize: 0,
    current: 1,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [currentCategory, setCurrentCategory] = useState<ItemCategoryInterface>();
  const [countHanlde, setCountHandle] = useState<number>(0);

  const intl = useIntl();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Name',
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
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Create by User',
      dataIndex: 'createBy',
      renderText: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Date',
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
            setCurrentRow(record);
            GetCategory(record.id);
            setShowDetail(true);
          }}
        >
          Detail
        </a>,
        <a
          key="uppdate"
          onClick={() => {
            console.log(record);
            setCurrentRow(record);
            console.log(currentRow);
            handleUpdateModalVisible(true);
          }}
        >
          Update
        </a>,
      ],
    },
  ];

  const handleCreate = (values: InputForm) => {
    CreateCategoryProxy({
      name: values.name,
      description: values.description,
    })
      .then((res) => {
        console.log(res)
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultCategoryFailureMessage = intl.formatMessage({
            id: 'pages.create.fail',
            defaultMessage: res.message ?? 'create category fail',
          });
          message.error(defaultCategoryFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultCategorySuccessMessage = intl.formatMessage({
            id: 'pages.create.success',
            defaultMessage: 'Success!',
          });
          message.success(defaultCategorySuccessMessage);
          handleModalVisible(false);
          setCountHandle(countHanlde + 1);
        }
      })
      .catch((err) => {
        const defaultCategoryFailureMessage = intl.formatMessage({
          id: 'pages.create.failure',
          defaultMessage: err.message ?? 'create category fail',
        });
        message.error(defaultCategoryFailureMessage);
      })
      .finally(() => { });
  };

  const updateCategory = (id: number, values: InputForm) => {
    UpdateCategoryProxy({
      id: id,
      name: values.name,
      description: values.description,
    })
      .then((res) => {
        console.log(res)
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultCategoryFailureMessage = intl.formatMessage({
            id: 'pages.update.fail',
            defaultMessage: res.message ?? 'Update Category fail',
          });
          message.error(defaultCategoryFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultCategorySuccessMessage = intl.formatMessage({
            id: 'pages.update.success',
            defaultMessage: 'Success!',
          });
          message.success(defaultCategorySuccessMessage);
          setCountHandle(countHanlde + 1);
          handleUpdateModalVisible(false);
          GetCategory(id);
          return;
        }
      })
      .catch((err) => {
        const defaultCategoryFailureMessage = intl.formatMessage({
          id: 'pages.update.fail',
          defaultMessage: err.message ?? 'Update Category fail',
        });
        message.error(defaultCategoryFailureMessage);
      })
      .finally(() => { });
  };

  const GetCategory = (id: number) => {
    GetCategoryProxy({
      id: id
    })
      .then((res) => {
        console.log(res);
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultCategoryFailureMessage = intl.formatMessage({
            id: 'pages.detail.fail',
            defaultMessage: res.message ?? 'get detail category fail',
          });
          message.error(defaultCategoryFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultCategorySuccessMessage = intl.formatMessage({
            id: 'pages.detail.success',
            defaultMessage: 'Success!',
          });
          setCurrentCategory(res?.data.itemCategory);
        }
      })
      .catch((err) => {
        const defaultCategoryFailureMessage = intl.formatMessage({
          id: 'pages.detail.fail',
          defaultMessage: err.message ?? 'get detail category fail',
        });
        message.error(defaultCategoryFailureMessage);
      })
      .finally(() => { });
  };


  useEffect(() => {
    CategoryListProxy({ page: currentPage, limit: pageSize })
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultCategoryFailureMessage = intl.formatMessage({
            id: 'pages.load.fails',
            defaultMessage: res.message ?? 'Load fail',
          });
          message.error(defaultCategoryFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultCategorySuccessMessage = intl.formatMessage({
            id: 'pages.load.success',
            defaultMessage: 'Success!',
          });
          let list: Array<TableListItem> = [];
          res?.data?.itemCategories.map((item) => {
            let tmp: TableListItem = {
              id: item.id,
              name: item.name,
              description: item.description,
              createBy: item.creator.name,
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
            });
          }
        }
      })
      .catch((err) => {
        const defaultCategoryFailureMessage = intl.formatMessage({
          id: 'pages.load.failure',
          defaultMessage: err ?? 'Load category fail',
        });
        message.error(defaultCategoryFailureMessage);
      });
  }, [intl, countHanlde, currentPage, pageSize]);


  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="Item Category Table"
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
        pagination={{
          pageSize: pageSize,
          total: pagination.total,
          current: pagination.current,
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
      <CreateForm
        modalVisible={createModalVisible}
        handleModalVisible={handleModalVisible}
        onSubmit={handleCreate}
      />
      {currentRow ? <UpdateForm
        modalVisible={updateModalVisible}
        handleModalVisible={handleUpdateModalVisible}
        onSubmit={updateCategory}
        currentItem={currentRow}
      /> : <></>}
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentCategory?.name && (
          <>
            <ProDescriptions<ItemCategoryInterface>
              column={1}
              title={currentCategory?.name}
              request={async () => ({
                data: currentCategory || {},
              })}
              params={{
                id: currentCategory?.name,
              }}
              columns={columns as ProDescriptionsItemProps<ItemCategoryInterface>[]}
            />
            <p>Create By: {currentCategory.creator.name}</p>
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default CategoryTable;