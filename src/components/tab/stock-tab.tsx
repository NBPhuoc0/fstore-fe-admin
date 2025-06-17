"use client";

import React, { useMemo, useState } from "react";
import { Card, InputNumber, Space, Table } from "antd";

interface InventoryItem {
  id: number;
  variantId: number;
  productId: number;
  stockQuantity: number;
  quantity: number;
  remainingQuantity: number;
  importBatchId: string;
  updatedAt: string;
}

interface StockTabProps {
  data: InventoryItem[];
}

export default function StockTab({ data }: StockTabProps) {
  const [filterProductId, setFilterProductId] = useState<number | undefined>(
    undefined
  );

  const filteredData = useMemo(() => {
    if (!filterProductId) return data;
    return data.filter((item) => item.productId === filterProductId);
  }, [data, filterProductId]);

  return (
    <Card>
      <Space style={{ marginBottom: 16 }}>
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
          title="Batch ID"
          dataIndex="importBatchId"
          align="center"
        />
        <Table.Column
          title="Stock Import Quantity"
          dataIndex="quantity"
          align="center"
        />
        <Table.Column
          title="Remaining Quantity"
          dataIndex="remainingQuantity"
          align="center"
        />
        <Table.Column
          title="Updated At"
          dataIndex="updatedAt"
          render={(value: string) => new Date(value).toLocaleString()}
        />
      </Table>
    </Card>
  );
}
