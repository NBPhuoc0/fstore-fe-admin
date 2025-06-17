"use client";

import { TicketShowModal } from "@components/modal/ticket/show";
import { ITicket, TicketStatus, TicketType } from "@interfaces";
import {
  List,
  RefreshButton,
  useTable,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Table, Space, Tag } from "antd";
import { useEffect, useState, useMemo } from "react";

export default function TicketList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  const { tableProps, tableQuery } = useTable<ITicket>({
    syncWithLocation: true,
  });

  const typeColorMap: Record<TicketType, string> = {
    RETURNED: "purple",
    EXCHANGE: "cyan",
    COMPLAINT: "orange",
    OTHERS: "default",
  };

  const statusColorMap: Record<TicketStatus, string> = {
    PENDING: "red",
    IN_PROGRESS: "orange",
    COMPLETED: "green",
    REJECTED: "gray",
  };

  return (
    <>
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
            <RefreshButton
              resource="tickets"
              onClick={() => tableQuery.refetch()}
            />
          </>
        )}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="Mã" />
          <Table.Column dataIndex="email" title="Email" />
          <Table.Column
            dataIndex="orderId"
            title="Mã đơn hàng"
            render={(val) => val ?? "Không có đơn"}
          />
          <Table.Column
            dataIndex="type"
            title="Loại phiếu"
            render={(val: TicketType) => (
              <Tag color={typeColorMap[val]}>
                {val === "RETURNED"
                  ? "Trả hàng"
                  : val === "EXCHANGE"
                  ? "Đổi hàng"
                  : val === "COMPLAINT"
                  ? "Khiếu nại"
                  : "Khác"}
              </Tag>
            )}
          />
          <Table.Column
            dataIndex="status"
            title="Trạng thái"
            render={(val: TicketStatus) => (
              <Tag color={statusColorMap[val]}>
                {val === "PENDING"
                  ? "Chờ xử lý"
                  : val === "IN_PROGRESS"
                  ? "Đang xử lý"
                  : val === "COMPLETED"
                  ? "Hoàn thành"
                  : val === "REJECTED"
                  ? "Từ chối"
                  : val}
              </Tag>
            )}
          />
          <Table.Column dataIndex="customerNote" title="Ghi chú khách hàng" />
          <Table.Column dataIndex="adminNote" title="Ghi chú quản trị" />
          <Table.Column
            dataIndex="createdAt"
            title="Ngày tạo"
            render={(val) => new Date(val).toLocaleString()}
          />
          <Table.Column
            title="Thao tác"
            render={(_, record: BaseRecord) => (
              <Space>
                <ShowButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => {
                    setSelectedTicket(record as ITicket);
                    setModalOpen(true);
                  }}
                />
                <DeleteButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  resource="tickets"
                />
              </Space>
            )}
          />
        </Table>
      </List>
      {modalOpen && (
        <TicketShowModal
          modalProps={{ open: modalOpen, onCancel: () => setModalOpen(false) }}
          data={selectedTicket}
          refetch={() => tableQuery.refetch()}
        />
      )}
    </>
  );
}
