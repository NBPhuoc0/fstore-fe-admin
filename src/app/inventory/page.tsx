"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Typography, Tabs, Spin, Space, Button, Card, Table, Tag } from "antd";
import { useApiUrl } from "@refinedev/core";
import { InventoryBulkUploadModal } from "@components/modal/inventory/bulk-upload";
import TransactionTab from "@components/card/transaction-tab";
import StockTab from "@components/card/stock-tab";
import ImportBatchTab from "@components/card/batch";
import { ImportBatchShowModal } from "@components/modal/inventory/show-batch";

const { TabPane } = Tabs;

export default function InventoryPage() {
  const apiUrl = useApiUrl();

  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [importBatchData, setImportBatchData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [batchId, setBatchId] = useState<number | null>(null);

  const [uploadType, setUploadType] = useState<"import" | "adjust" | null>(
    null
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, importBatchRes, lowStockRes] = await Promise.all([
        fetch(`${apiUrl}/inventory/transactions`).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch transaction data");
          }
          return res.json();
        }),
        fetch(`${apiUrl}/inventory/import-batch`).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch import batch data");
          }
          return res.json();
        }),
        fetch(`${apiUrl}/inventory/low-stock`).then((res) => res.json()),
      ]);

      setTransactionData(transactionsRes);
      setImportBatchData(importBatchRes);
      setLowStockProducts(lowStockRes);
    } catch (err) {
      console.error("Fetch inventory failed", err);
    }
    setLoading(false);
  };

  const [lowStockPage, setLowStockPage] = useState(1);
  const [lowStockPageSize, setLowStockPageSize] = useState(5);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>Inventory Management</Typography.Title>

      <Spin spinning={loading}>
        {lowStockProducts.length > 0 && (
          <Card
            title={`Sản phẩm sắp hết hàng (Tổng: ${lowStockProducts.length})`}
            style={{ marginBottom: 24 }}
          >
            <Table
              dataSource={lowStockProducts}
              rowKey="productId"
              pagination={{
                current: lowStockPage,
                pageSize: lowStockPageSize,
                onChange: (page, pageSize) => {
                  setLowStockPage(page);
                  setLowStockPageSize(pageSize);
                },
              }}
              size="small"
              bordered
            >
              <Table.Column title="ID" dataIndex="productId" />
              <Table.Column title="Tên sản phẩm" dataIndex="name" />
              <Table.Column
                title="Tổng Tồn kho"
                dataIndex="totalQuantity"
                render={(val: number) => (
                  <Tag color={val === 0 ? "red" : "orange"}>{val}</Tag>
                )}
              />
            </Table>
          </Card>
        )}
        <Tabs
          defaultActiveKey="stock"
          tabBarExtraContent={
            <Space>
              <Button type="primary" onClick={() => setUploadType("import")}>
                Import Bulk
              </Button>
              <Button type="primary" onClick={() => setUploadType("adjust")}>
                Adjust Bulk
              </Button>
            </Space>
          }
        >
          <TabPane tab="Lô hàng" key="import-batch">
            <ImportBatchTab
              data={importBatchData}
              onClickBatch={(id) => setBatchId(id)}
            />
          </TabPane>

          <TabPane tab="Thông tin giao dịch" key="transactions">
            <TransactionTab data={transactionData} />
          </TabPane>
        </Tabs>
      </Spin>

      <InventoryBulkUploadModal
        open={!!uploadType}
        type={uploadType as "import" | "adjust"}
        onClose={() => setUploadType(null)}
        onSuccess={fetchData}
      />

      <ImportBatchShowModal
        open={!!batchId}
        onClose={() => setBatchId(null)}
        batchId={batchId}
      />
    </div>
  );
}
