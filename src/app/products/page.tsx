"use client";
import { ProductShowModal } from "@components/modal/product/show";
import { IProduct } from "@interfaces";
import {
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
  List,
  RefreshButton,
  ImageField,
  useModal,
} from "@refinedev/antd";
import { BaseRecord, useRefreshButton } from "@refinedev/core";
import { Input, Space, Table } from "antd";
import { useEffect, useState, useMemo } from "react";

export default function ProductList() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { tableProps, tableQuery } = useTable<IProduct>({
    syncWithLocation: true,
  });
  const { show, close, modalProps } = useModal();
  const [productData, setProductData] = useState<IProduct | null>(null);
  const showProduct = (data: IProduct) => {
    setProductData(data);
    show();
  };
  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(() => {
    if (!searchText) return tableProps.dataSource || [];
    return (tableProps.dataSource || []).filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [tableProps.dataSource, searchText]);

  const useR = () => {
    tableQuery.refetch();
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
            <RefreshButton resource="products" onClick={useR} />
          </>
        )}
      >
        <Table {...tableProps} rowKey="id" dataSource={filteredData}>
          <Table.Column dataIndex="id" title={"ID"} />
          <Table.Column dataIndex="name" title={"Name"} />
          <Table.Column
            dataIndex="photos"
            title={"image"}
            render={(_, record) => (
              <>
                <ImageField value={record.photos[0].url} width={150} />

                <ImageField value={record.photos[1].url} width={150} />
              </>
            )}
          />
          <Table.Column dataIndex="originalPrice" title={"Original Price"} />

          <Table.Column
            dataIndex={"category"}
            title={"Category"}
            render={(value) => (value ? `${value.id} - ${value.name}` : "")}
          />

          <Table.Column
            title={"Actions"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                {/* <EditButton hideText size="small" recordItemId={record.id} /> */}
                <ShowButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={showProduct.bind(null, record as IProduct)}
                />
                {/* <DeleteButton hideText size="small" recordItemId={record.id} /> */}
              </Space>
            )}
          />
        </Table>
      </List>
      {isClient && (
        <>
          <ProductShowModal
            modalProps={modalProps}
            data={productData}
            onRefetch={useR}
            // refetch={() => tableQuery.refetch()}
          />{" "}
        </>
      )}
    </>
  );
}
