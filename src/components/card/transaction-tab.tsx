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
  orderId?: number;
  importBatchId?: number;
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
  const [filterOrderId, setFilterOrderId] = useState<number | undefined>(
    undefined
  );
  const [filterImportBatchId, setFilterImportBatchId] = useState<
    number | undefined
  >(undefined);

  const filteredData = useMemo(() => {
    let result = [...data];
    if (filterType) {
      result = result.filter((item) => item.transactionType === filterType);
    }
    if (filterProductId) {
      result = result.filter((item) => item.productId === filterProductId);
    }
    if (filterOrderId) {
      result = result.filter((item) => item.orderId === filterOrderId);
    }
    if (filterImportBatchId) {
      result = result.filter(
        (item) => item.importBatchId === filterImportBatchId
      );
    }
    return result;
  }, [data, filterType, filterProductId, filterOrderId, filterImportBatchId]);

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="
           loại giao dịch"
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
          placeholder="Mã sản phẩm ID"
          min={1}
          style={{ width: 200 }}
          value={filterProductId}
          onChange={(value) => setFilterProductId(value ?? undefined)}
        />
        <InputNumber
          placeholder="Mã đơn hàng ID"
          min={1}
          style={{ width: 200 }}
          value={filterOrderId}
          onChange={(value) => setFilterOrderId(value ?? undefined)}
        />
        <InputNumber
          placeholder="Lô hàng ID"
          min={1}
          style={{ width: 200 }}
          value={filterImportBatchId}
          onChange={(value) => setFilterImportBatchId(value ?? undefined)}
        />
      </Space>

      <Table
        dataSource={filteredData}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      >
        <Table.Column title="Mã sản phẩm" dataIndex="productId" />
        <Table.Column title="Mã biến thể" dataIndex="variantId" />
        <Table.Column
          title="Loại giao dịch"
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
        <Table.Column title="Số lượng" dataIndex="quantity" align="center" />
        <Table.Column
          title="Giá"
          dataIndex="price"
          align="right"
          render={(value?: number) =>
            value ? `${value.toLocaleString("vi-VN")} ₫` : "-"
          }
        />
        <Table.Column title="Ghi chú" dataIndex="note" />
        <Table.Column
          title="Ngày tạo"
          dataIndex="createdAt"
          render={(value: string) => new Date(value).toLocaleString()}
        />
      </Table>
    </Card>
  );
}
