"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Typography,
  Tabs,
  Card,
  Tag,
  Spin,
  Select,
  Space,
  InputNumber,
  Button,
} from "antd";
import { useApiUrl } from "@refinedev/core";
import { InventoryBulkUploadModal } from "@components/modal/inventory/bulk-upload";

const { TabPane } = Tabs;

interface InventoryItem {
  id: number;
  variantId: number;
  productId: number;
  stockQuantity: number;
  updatedAt: string;
  createdAt: string;
}

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

export default function InventoryPage() {
  const apiUrl = useApiUrl();

  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<InventoryItem[]>([]);
  const [transactionData, setTransactionData] = useState<TransactionItem[]>([]);

  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterProductId, setFilterProductId] = useState<number | undefined>(
    undefined
  );

  const [uploadType, setUploadType] = useState<"import" | "adjust" | null>(
    null
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stockRes, transactionsRes] = await Promise.all([
        fetch(`${apiUrl}/inventory/stock`).then((res) => res.json()),
        fetch(`${apiUrl}/inventory/transactions`).then((res) => res.json()),
      ]);

      setStockData(stockRes);
      setTransactionData(transactionsRes);
    } catch (err) {
      console.error("Fetch inventory failed", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  Filte cho Transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactionData];

    if (filterType) {
      result = result.filter((item) => item.transactionType === filterType);
    }

    if (filterProductId) {
      result = result.filter((item) => item.productId === filterProductId);
    }

    // (Không còn sortOrder nữa)
    return result;
  }, [transactionData, filterType, filterProductId]);
  // Filter cho Stock theo Product ID
  const filteredStock = useMemo(() => {
    if (!filterProductId) return stockData;
    return stockData.filter((item) => item.productId === filterProductId);
  }, [stockData, filterProductId]);

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>Inventory Management</Typography.Title>

      <Spin spinning={loading}>
        <Tabs
          defaultActiveKey="stock"
          tabBarExtraContent={
            <Space>
              <Button type="primary" onClick={() => setUploadType("import")}>
                Import Bulk
              </Button>
              <Button danger onClick={() => setUploadType("adjust")}>
                Adjust Bulk
              </Button>
            </Space>
          }
        >
          {/* Stock Tab */}
          <TabPane tab="Stock" key="stock">
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
                dataSource={filteredStock}
                rowKey="id"
                bordered
                pagination={{ pageSize: 10 }}
              >
                <Table.Column title="Product" dataIndex="productId" />
                <Table.Column title="Variant" dataIndex="variantId" />
                <Table.Column
                  title="Stock Quantity"
                  dataIndex="stockQuantity"
                  align="center"
                />
                <Table.Column
                  title="Updated At"
                  dataIndex="updatedAt"
                  render={(value: string) => new Date(value).toLocaleString()}
                />
              </Table>
            </Card>
          </TabPane>

          {/* Transactions Tab */}
          <TabPane tab="Transactions" key="transactions">
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
                dataSource={filteredTransactions}
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
                <Table.Column
                  title="Quantity"
                  dataIndex="quantity"
                  align="center"
                />
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
          </TabPane>
        </Tabs>
      </Spin>
      <InventoryBulkUploadModal
        open={!!uploadType}
        type={uploadType as "import" | "adjust"}
        onClose={() => setUploadType(null)}
        onSuccess={fetchData} // Sau khi import xong tự động reload lại data
      />
    </div>
  );
}
