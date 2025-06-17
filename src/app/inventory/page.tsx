"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Typography, Tabs, Spin, Space, Button } from "antd";
import { useApiUrl } from "@refinedev/core";
import { InventoryBulkUploadModal } from "@components/modal/inventory/bulk-upload";
import TransactionTab from "@components/tab/transaction-tab";
import StockTab from "@components/tab/stock-tab";
import ImportBatchTab from "@components/tab/batch";

const { TabPane } = Tabs;

export default function InventoryPage() {
  const apiUrl = useApiUrl();

  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [importBatchData, setImportBatchData] = useState([]);

  const [uploadType, setUploadType] = useState<"import" | "adjust" | null>(
    null
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stockRes, transactionsRes, importBatchRes] = await Promise.all([
        fetch(`${apiUrl}/inventory/stock`).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch stock data");
          }
          return res.json();
        }),
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
      ]);

      setStockData(stockRes);
      setTransactionData(transactionsRes);
      setImportBatchData(importBatchRes);
    } catch (err) {
      console.error("Fetch inventory failed", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              <Button type="primary" onClick={() => setUploadType("adjust")}>
                Adjust Bulk
              </Button>
            </Space>
          }
        >
          {/* <TabPane tab="Stock" key="stock">
            <StockTab data={stockData} />
          </TabPane> */}

          <TabPane tab="Import Batch" key="import-batch">
            <ImportBatchTab data={importBatchData} />
          </TabPane>

          <TabPane tab="Transactions" key="transactions">
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
    </div>
  );
}
