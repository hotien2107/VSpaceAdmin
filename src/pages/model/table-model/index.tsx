import CreateItemProxy from '@/services/proxy/items/create-item';
import DeleteItemProxy from '@/services/proxy/items/delete-item';
import ItemListProxy from '@/services/proxy/items/get-items';
import UpdateItemProxy from '@/services/proxy/items/update-item';
import { ProxyStatusEnum } from '@/types/http/proxy/ProxyStatus';
import { CategoryInterface } from '@/types/item';
import { PlusOutlined } from '@ant-design/icons';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
import type { TableListItem, TableListPagination, InputForm, FilterInterface } from './data.d';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import CategoryListProxy from '@/services/proxy/item-categories/get-item-categories';
const TableList: React.FC = () => {
  const [itemList, setItemList] = useState<TableListItem[]>([]);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [countGetItemList, setCountGetItemList] = useState<number>(0);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filter, setFilter] = useState<FilterInterface[]>([]);
  const [pagination, setPagination] = useState<TableListPagination>({
    total: 0,
    pageSize: 0,
    current: 1,
    name: "",
    modelPath: "",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [name, setName] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [sorter, setSorter] = useState<string>("");


  const intl = useIntl();

  const handleCreate = (value:InputForm) => {
    console.log(value);
    CreateItemProxy({
      name: value.name,
      modelPath: value.modelPath,
      image: value.image,
      categoryId: value.categoryId,
    })
      .then((res) => {
        console.log(res);
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error('Create item fail');
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          message.success('Create item success');
          handleModalVisible(false);
          setCountGetItemList(countGetItemList + 1);
        }
      })
      .catch((err) => {
        message.error('Create item fail', err);
      })
      .finally(() => { });
  };

  const deleteItem = (id: number) => {
    DeleteItemProxy({
      id: id,
    })
      .then((res) => {
        console.log(res);
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultItemFailureMessage = intl.formatMessage({
            id: 'pages.delete.fail',
            defaultMessage: res.message ?? 'delete item fail',
          });
          message.error(defaultItemFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          const defaultItemSuccessMessage = intl.formatMessage({
            id: 'pages.delete.success',
            defaultMessage: 'Success!',
          });
          message.success(defaultItemSuccessMessage);
          setCountGetItemList(countGetItemList + 1);
        }
      })
      .catch((err) => {
        const defaultItemFailureMessage = intl.formatMessage({
          id: 'pages.delete.failure',
          defaultMessage: err.message ?? 'delete item fail',
        });
        message.error(defaultItemFailureMessage);
      })
      .finally(() => { });
  };

  const updateItem = (values: InputForm, id: number) => {
    console.log(id);
    console.log(values);
    UpdateItemProxy({
      id: id,
      name: values.name,
      modelPath: values.modelPath,
      image: values.image,
      categoryId: values.categoryId,
    })
      .then((res) => {
        console.log(res)
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultCategoryFailureMessage = intl.formatMessage({
            id: 'pages.update.fail',
            defaultMessage: res.message ?? 'Update Item fail',
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
          setCountGetItemList(countGetItemList + 1);
          setCurrentRow(undefined);
          handleUpdateModalVisible(false);
          return;
        }
      })
      .catch((err) => {
        const defaultCategoryFailureMessage = intl.formatMessage({
          id: 'pages.update.fail',
          defaultMessage: err.message ?? 'Update Item fail',
        });
        message.error(defaultCategoryFailureMessage);
      })
      .finally(() => { });
  };

  useEffect(() => {
    ItemListProxy({ page: currentPage, limit: pageSize, "name[contains]": name, "path[startsWith]": path, sort_by: sorter })
      .then((res) => {
        console.log(res);
        if (res.status === ProxyStatusEnum.FAIL) {
          const defaultItemFailureMessage = intl.formatMessage({
            id: 'pages.load.fail',
            defaultMessage: res.message ?? 'get items fail',
          });
          message.error(defaultItemFailureMessage);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          setItemList(res.data?.items ?? []);
          if (res?.data?.pagination) {
            setPagination({
              total: res?.data?.pagination?.totalCount ?? 0,
              pageSize: pageSize,
              current: res?.data?.pagination?.page ?? 1,
              name: "",
              modelPath: "",
            });
          }
        }
      })
      .catch((err) => {
        const defaultItemFailureMessage = intl.formatMessage({
          id: 'pages.load.fail',
          defaultMessage: err ?? 'get items fail',
        });
        message.error(defaultItemFailureMessage);
      });

      CategoryListProxy({})
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error("Don't load category list");
          return;
        }
  
        if (res.status === ProxyStatusEnum.SUCCESS) {
          let list: Array<FilterInterface> = [];
          res?.data?.itemCategories.map((item) => {
            let tmp: FilterInterface = {
              value: item.id,
              text: item.name
            }
            list.push(tmp);
          })
          setFilter(list);
        }
      })
      .catch((err) => {
        message.error("Don't load category list");
      });
  }, [intl, countGetItemList, currentPage, pageSize, name, path, sorter]);


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
      title: 'Model Path',
      dataIndex: 'modelPath',
      renderText: (text: string) => <a href={text}>{text}</a>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      renderText: (text: string) => <img src={text} alt="model" width={40} height={40} />,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      filters: filter,
      onFilter: true,
      renderText: (text: CategoryInterface) => <p>{text.name}</p>,
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
          key="view"
          onClick={() => {
            setShowDetail(true);
            setCurrentRow(record);
          }}
        >
          Detail
        </a>,
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateModalVisible(true);
          }}
        >
          Update
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="Model Table"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
        }}
        request={(params, sorter, filter) => {
          console.log(filter);
          setName(params?.name);
          setPath(params?.modelPath);
          let nameSorter: string = "";
          nameSorter = sorter.name && sorter.name === "ascend" ? "name" : "-name";
          let createAtSorter: string = "";
          createAtSorter = sorter.createAt && sorter.createAt === "ascend" ? "create_at" : "-create_at";
          setSorter(nameSorter + "," + createAtSorter);
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
              <span>Are you sure want to delete this model?</span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              selectedRowsState.map((item) => {
                deleteItem(item.id);
              });
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Yes
          </Button>
          <Button type="primary">No</Button>
        </FooterToolbar>
      )}
      <CreateForm
      modalVisible={createModalVisible}
      handleModalVisible={handleModalVisible}
      onSubmit={handleCreate}
      />
           {currentRow? <UpdateForm
      modalVisible={updateModalVisible}
      handleModalVisible={handleUpdateModalVisible}
      onSubmit={updateItem}
      currentItem={currentRow}
      />:<></>}
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
            column={1}
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
