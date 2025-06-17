"use client";

import { ProductShowModal } from "@components/modal/product/show";
import { IProduct } from "@interfaces";
import {
  ShowButton,
  List,
  RefreshButton,
  ImageField,
  useModal,
  DeleteButton,
} from "@refinedev/antd";
import { BaseRecord, useApiUrl, useCustom } from "@refinedev/core";
import { Input, Space, Table, Spin, PaginationProps } from "antd";
import { useEffect, useState, useMemo } from "react";

export default function ProductList() {
  const apiUrl = useApiUrl();
  const [isClient, setIsClient] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<
    number | undefined
  >(undefined);
  const [searchText, setSearchText] = useState("");

  // Thêm state pagination
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading, refetch } = useCustom<{
    data: IProduct[];
    total: number;
  }>({
    url: `${apiUrl}/products`,
    method: "get",
    config: {
      query: {
        current: current.toString(),
        pageSize: pageSize.toString(),
      },
    },
  });

  const filteredData = useMemo(() => {
    const list = data?.data?.data || [];
    if (!searchText) return list;
    return list.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data?.data?.data, searchText]);

  const pagination: PaginationProps = {
    current,
    pageSize,
    total: data?.data?.total || 0,
    onChange: (page, size) => {
      setCurrent(page);
      setPageSize(size);
    },
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
  };

  return (
    <>
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
            <Input.Search
              placeholder="Tìm kiếm theo tên"
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <RefreshButton resource="products" onClick={() => refetch()} />
          </>
        )}
      >
        <Spin spinning={isLoading}>
          <Table rowKey="id" dataSource={filteredData} pagination={pagination}>
            <Table.Column dataIndex="id" title={"Mã"} />
            <Table.Column dataIndex="name" title={"Tên sản phẩm"} />
            <Table.Column
              dataIndex="photos"
              title={"Hình ảnh"}
              render={(_, record) => (
                <>
                  {record.photos?.[0]?.url && (
                    <ImageField value={record.photos[0].url} width={100} />
                  )}
                  {record.photos?.[1]?.url && (
                    <ImageField value={record.photos[1].url} width={100} />
                  )}
                </>
              )}
            />
            <Table.Column dataIndex="originalPrice" title={"Giá gốc"} />
            <Table.Column
              dataIndex="category"
              title={"Danh mục"}
              render={(value) => (value ? `${value.id} - ${value.name}` : "")}
            />
            <Table.Column
              title={"Thao tác"}
              dataIndex="actions"
              render={(_, record: BaseRecord) => (
                <Space>
                  <ShowButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onClick={() => setSelectedProductId(record.id as number)}
                  />
                  <DeleteButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    resource="products"
                    onSuccess={() => refetch()}
                  />
                </Space>
              )}
            />
          </Table>
        </Spin>
      </List>

      {isClient && (
        <ProductShowModal
          modalProps={{
            open: !!selectedProductId,
            onCancel: () => setSelectedProductId(undefined),
          }}
          productId={selectedProductId}
          onRefetch={() => refetch()}
        />
      )}
    </>
  );
}
