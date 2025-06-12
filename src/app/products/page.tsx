"use client";
import { IProduct } from "@interfaces";
import {
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
  List,
  RefreshButton,
  ImageField,
} from "@refinedev/antd";
import { BaseRecord, useRefreshButton } from "@refinedev/core";
import { Space, Table } from "antd";

export default function ProductList() {
  const { tableProps, tableQuery } = useTable<IProduct>({
    syncWithLocation: true,
  });

  const useR = () => {
    tableQuery.refetch();
  };

  return (
    <>
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
            <RefreshButton resource="products" onClick={useR} />
          </>
        )}
      >
        <Table {...tableProps} rowKey="id">
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
          {/* <Table.Column dataIndex="urlHandle" title={"URL Handle"} /> */}
          {/* <Table.Column dataIndex="code" title={"Code"} /> */}
          {/* <Table.Column
            dataIndex="display"
            title={"Display"}
            render={(value) => (value ? "Yes" : "No")}
          /> */}
          {/* <Table.Column
            dataIndex="inventoryStatus"
            title={"Inventory Status"}
            render={(value) => (value ? "InStock" : "Out of Stock")}
          /> */}
          {/* <Table.Column dataIndex="metaDesc" title={"Description"} /> */}
          <Table.Column dataIndex="originalPrice" title={"Original Price"} />
          {/* <Table.Column
            dataIndex="promotion"
            title={"Promotion"}
            render={(value) => (value ? `${value.name}` : "none")}
          />
          <Table.Column
            dataIndex="salePrice"
            title={"Sale Price"}
            render={(value) => (value ? `${value.name}` : "none")}
          /> */}

          <Table.Column
            dataIndex={"category"}
            title={"Category"}
            render={(value) => (value ? `${value.id} - ${value.name}` : "")}
          />
          {/* 
          <Table.Column
            dataIndex={"brand"}
            title={"Brand"}
            render={(value) => (value ? `${value.id} - ${value.name}` : "")}
          /> */}

          <Table.Column
            title={"Actions"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>
    </>
  );
}
