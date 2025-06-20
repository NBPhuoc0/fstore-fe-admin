"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Tag } from "antd";
import { useApiUrl } from "@refinedev/core";

export default function LowStockWarning() {
  const apiUrl = useApiUrl();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchLowStock = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/inventory/low-stock`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching low-stock", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLowStock();
  }, [apiUrl]);

  if (!data.length) return null;

  return (
    <Card
      title={`Sản phẩm sắp hết hàng (Tổng: ${data.length})`}
      style={{ marginBottom: 24 }}
      loading={loading}
    >
      <Table
        dataSource={data}
        rowKey="productId"
        pagination={{
          current: page,
          pageSize,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
        size="small"
        bordered
      >
        <Table.Column title="ID" dataIndex="productId" />
        <Table.Column title="Tên sản phẩm" dataIndex="name" />
        <Table.Column
          title="Tồn kho"
          dataIndex="totalQuantity"
          render={(val: number) => (
            <Tag color={val === 0 ? "red" : "orange"}>{val}</Tag>
          )}
        />
      </Table>
    </Card>
  );
}
