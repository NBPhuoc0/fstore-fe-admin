"use client";

import React from "react";
import { Card, Table, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { ShowButton } from "@refinedev/antd";

interface ImportBatchItem {
  id: number;
  supplierName?: string;
  note?: string;
  totalCost?: number;
  incidentalCosts?: number;
  createdAt: string;
  createdBy?: string;
}

interface ImportBatchTabProps {
  data: ImportBatchItem[];
  onClickBatch?: (id: number) => void; // callback khi click xem
}

export default function ImportBatchTab({
  data,
  onClickBatch,
}: ImportBatchTabProps) {
  return (
    <Card>
      <Table
        dataSource={data}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      >
        <Table.Column title="Batch ID" dataIndex="id" />
        <Table.Column
          title="Nhà cung cấp"
          dataIndex="supplierName"
          render={(val) => val ?? "-"}
        />
        <Table.Column
          width={400}
          title="Ghi chú"
          dataIndex="note"
          render={(val) => val ?? "-"}
        />
        <Table.Column
          title="Tổng chi phí"
          dataIndex="totalCost"
          align="right"
          render={(val) => (val ? `${val.toLocaleString("vi-VN")} ₫` : "-")}
        />
        <Table.Column
          title="Chi phí phát sinh"
          dataIndex="incidentalCosts"
          align="right"
          render={(val) => (val ? `${val.toLocaleString("vi-VN")} ₫` : "-")}
        />
        <Table.Column
          title="Người tạo"
          dataIndex="createdBy"
          render={(val) => val ?? "-"}
        />
        <Table.Column
          title="Ngày tạo"
          dataIndex="createdAt"
          render={(val: string) => new Date(val).toLocaleString()}
        />
        <Table.Column
          title="Thao tác"
          key="actions"
          render={(_, record) => (
            <ShowButton
              hideText
              size="small"
              icon={<EyeOutlined />}
              recordItemId={record.id}
              onClick={() => onClickBatch?.(record.id)}
            />
          )}
        />
      </Table>
    </Card>
  );
}
