"use client";

import React from "react";
import { Card, Table } from "antd";

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
}

export default function ImportBatchTab({ data }: ImportBatchTabProps) {
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
          title="Supplier Name"
          dataIndex="supplierName"
          render={(val) => val ?? "-"}
        />
        <Table.Column
          width={400}
          title="Note"
          dataIndex="note"
          render={(val) => val ?? "-"}
        />
        <Table.Column
          title="Total Cost"
          dataIndex="totalCost"
          align="right"
          render={(val) => (val ? `${val.toLocaleString("vi-VN")} ₫` : "-")}
        />
        <Table.Column
          title="Incidental Costs"
          dataIndex="incidentalCosts"
          align="right"
          render={(val) => (val ? `${val.toLocaleString("vi-VN")} ₫` : "-")}
        />
        <Table.Column
          title="Created By"
          dataIndex="createdBy"
          render={(val) => val ?? "-"}
        />
        <Table.Column
          title="Created At"
          dataIndex="createdAt"
          render={(val: string) => new Date(val).toLocaleString()}
        />
      </Table>
    </Card>
  );
}
