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
import { Button, Drawer, Input, message, Modal } from 'antd';
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
  const [filters, setFilter] = useState<FilterInterface[]>([]);
  const [pagination, setPagination] = useState<TableListPagination>({
    total: 0,
    pageSize: 0,
    current: 1,
    name: "",
    modelPath: "",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [sorter, setSorter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const intl = useIntl();

  const handleCreate = (value: InputForm) => {
    setIsLoading(true);
    CreateItemProxy({
      name: value.name,
      modelPath: value.modelPath,
      image: value.image,
      categoryId: value.categoryId,
    })
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error(res?.message?? 'Create model fail');
          setIsLoading(false);
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          message.success('Create model success');
          handleModalVisible(false);
          setIsLoading(false);
          setCountGetItemList(countGetItemList + 1);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        message.error(err.message ?? 'Create model fail');
      })
      .finally(() => { });
  };

  const deleteItem = (id: number) => {
    DeleteItemProxy({
      id: id,
    })
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error(res.message ?? 'Delete model fail');
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          message.success('Success!');
          setCountGetItemList(countGetItemList + 1);
        }
      })
      .catch((err) => {
        message.error(err.message ?? 'Delete model fail');
      })
      .finally(() => { });
  };

  const updateItem = (values: InputForm, id: number) => {
    setIsLoading(false);

    UpdateItemProxy({
      id: id,
      name: values.name,
      modelPath: values.modelPath,
      image: values.image,
      categoryId: values.categoryId,
    })
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          message.error(res.message ?? 'Update model fail');
          return;
        }

        if (res.status === ProxyStatusEnum.SUCCESS) {
          setIsLoading(false);
          message.success( 'Success!');
          setCountGetItemList(countGetItemList + 1);
          setCurrentRow(undefined);
          handleUpdateModalVisible(false);
          return;
        }
      })
      .catch((err) => {
        setIsLoading(false);

        message.error( err.message ?? 'Update model fail');
      })
      .finally(() => { });
  };

  const handleFilter = (filter: any) => {
    let cateFilter: string = "";
    filter?.category?.map((item: any) => {
      cateFilter += item.toString() + ',';
    })
    if (cateFilter.length > 1) {
      cateFilter = cateFilter.substring(0, cateFilter.length - 1)
    }
    setCategoryId(cateFilter);
  }

  const customField = (key: string) => {
    let tmp: string = "";
    switch (key) {
      case "createdAt":
        tmp = "created_at";
        break;
      case "updatedAt":
        tmp = "updated_at";
        break;
      case "category":
        tmp = "category_name";
        break;
      default:
        tmp = key;
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

  useEffect(() => {
    let tmp: Object = {
      page: currentPage,
      limit: pageSize,
      "name[contains]": name,
      "path[startsWith]": path,
      sort_by: sorter,
    };

    if (categoryId !== "") {
      tmp = {
        page: currentPage,
        limit: pageSize,
        "name[contains]": name,
        "path[startsWith]": path,
        category_id: categoryId,
        sort_by: sorter
      };
    }
    setIsLoading(true);

    ItemListProxy(tmp)
      .then((res) => {
        if (res.status === ProxyStatusEnum.FAIL) {
          setIsLoading(false);

          message.error(res.message ?? 'Load items fail');
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
        setIsLoading(false);

      })
      .catch((err) => {
        setIsLoading(false);

        message.error(err?.message ?? 'get items fail');
      });

    CategoryListProxy({})
      .then((res) => {
        console.log(res)
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
  }, [intl, countGetItemList, currentPage, pageSize, name, path, sorter, categoryId]);


  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
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
      title: 'Model Path',
      dataIndex: 'modelPath',
      renderText: (text: string) => <a href={text}>{text}</a>,
    },
    {
      hideInSearch: true,
      title: 'Image',
      dataIndex: 'image',
      renderText: (text: string) => <img src={text} alt="model" width={40} height={40} />,
    },
    {
      hideInSearch: true,
      title: 'Category',
      dataIndex: 'category',
      filters: filters,
      sorter: {
        multiple: 2,
      },
      // onFilter: true,
      renderText: (category: CategoryInterface) => <p>{category?.name}</p>,
    },
    {
      hideInSearch: true,
      title: 'Created At',
      sorter: {
        multiple: 3,
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
      hideInSearch: true,
      title: 'Option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            setShowDetail(true);
            setCurrentRow(record);
          }}
        >
          Detail
        </a>,
        <a
          key="update"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateModalVisible(true);
          }}
        >
          Update
        </a>,
        <a
          key="delete"
          onClick={() => {
            setCurrentRow(record);
            (currentRow);
            handleDeleteModalVisible(true);
          }}
        >
          Delete
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="Model Table"
        loading={isLoading}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
        }}
        request={(params, sorter, filter) => {
          setName(params?.name);
          setPath(params?.modelPath);
          handleFilter(filter);
          handleSorter(sorter);
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
          <Button 
          type="primary"
          onClick={async () => {
            setSelectedRows([]);
            actionRef.current?.reloadAndRest?.();
          }}
          >No</Button>
        </FooterToolbar>
      )}
      <Modal
        title="Delete Category"
        visible={deleteModalVisible}
        onOk={() => {
          handleDeleteModalVisible(false);
          if (currentRow) {
            deleteItem(currentRow?.id)
          }
        }}
        onCancel={() => {
          handleDeleteModalVisible(false);
        }}
      >
        <p>Do you want to delete this office?</p>
      </Modal>
      <CreateForm
        modalVisible={createModalVisible}
        handleModalVisible={handleModalVisible}
        onSubmit={handleCreate}
      />
      {currentRow ? <UpdateForm
        modalVisible={updateModalVisible}
        handleModalVisible={handleUpdateModalVisible}
        onSubmit={updateItem}
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
