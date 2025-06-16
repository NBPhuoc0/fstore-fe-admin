"use client";

import { TicketShowModal } from "@components/modal/ticket/show";
import { ITicket, TicketStatus, TicketType } from "@interfaces";
import { List, RefreshButton, useTable, ShowButton } from "@refinedev/antd";
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
          <Table.Column dataIndex="id" title="ID" />
          <Table.Column dataIndex="email" title="Email" />
          <Table.Column
            dataIndex="orderId"
            title="Order ID"
            render={(val) => val ?? "No Order"}
          />
          <Table.Column
            dataIndex="type"
            title="Type"
            render={(val: TicketType) => (
              <Tag color={typeColorMap[val]}>{val}</Tag>
            )}
          />
          <Table.Column
            dataIndex="status"
            title="Status"
            render={(val: TicketStatus) => (
              <Tag color={statusColorMap[val]}>{val}</Tag>
            )}
          />
          <Table.Column dataIndex="customerNote" title="Customer Note" />
          <Table.Column dataIndex="adminNote" title="Admin Note" />
          <Table.Column
            dataIndex="createdAt"
            title="Created At"
            render={(val) => new Date(val).toLocaleString()}
          />
          <Table.Column
            title="Actions"
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
