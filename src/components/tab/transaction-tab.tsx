"use client";

import React, { useMemo, useState } from "react";
import { Card, InputNumber, Select, Space, Table, Tag } from "antd";

enum InventoryTransactionType {
  IMPORT = "IMPORT",
  EXPORT = "EXPORT",
  RETURN = "RETURN",
  ADJUST = "ADJUST",
}

interface TransactionItem {
  id: number;
  variantId: number;
  productId: number;
  quantity: number;
  transactionType: InventoryTransactionType;
  price?: number;
  note?: string;
  createdAt: string;
}

interface TransactionTabProps {
  data: TransactionItem[];
}

export default function TransactionTab({ data }: TransactionTabProps) {
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterProductId, setFilterProductId] = useState<number | undefined>(
    undefined
  );

  const filteredData = useMemo(() => {
    let result = [...data];
    if (filterType) {
      result = result.filter((item) => item.transactionType === filterType);
    }
    if (filterProductId) {
      result = result.filter((item) => item.productId === filterProductId);
    }
    return result;
  }, [data, filterType, filterProductId]);

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by Type"
          allowClear
          style={{ width: 180 }}
          value={filterType}
          onChange={(value) => setFilterType(value)}
        >
          <Select.Option value="IMPORT">IMPORT</Select.Option>
          <Select.Option value="EXPORT">EXPORT</Select.Option>
          <Select.Option value="RETURN">RETURN</Select.Option>
          <Select.Option value="ADJUST">ADJUST</Select.Option>
        </Select>

        <InputNumber
          placeholder="Filter by Product ID"
          min={1}
          style={{ width: 200 }}
          value={filterProductId}
          onChange={(value) => setFilterProductId(value ?? undefined)}
        />
      </Space>

      <Table
        dataSource={filteredData}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      >
        <Table.Column title="Product" dataIndex="productId" />
        <Table.Column title="Variant" dataIndex="variantId" />
        <Table.Column
          title="Type"
          dataIndex="transactionType"
          align="center"
          render={(value: string) => {
            let color = "default";
            if (value === "IMPORT") color = "green";
            if (value === "EXPORT") color = "red";
            if (value === "RETURN") color = "blue";
            if (value === "ADJUST") color = "orange";
            return <Tag color={color}>{value}</Tag>;
          }}
        />
        <Table.Column title="Quantity" dataIndex="quantity" align="center" />
        <Table.Column
          title="Price"
          dataIndex="price"
          align="right"
          render={(value?: number) =>
            value ? `${value.toLocaleString("vi-VN")} ₫` : "-"
          }
        />
        <Table.Column title="Note" dataIndex="note" />
        <Table.Column
          title="Created At"
          dataIndex="createdAt"
          render={(value: string) => new Date(value).toLocaleString()}
        />
      </Table>
    </Card>
  );
}
