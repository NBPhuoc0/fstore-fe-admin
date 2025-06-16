"use client";

import {
  Modal,
  ModalProps,
  Descriptions,
  Typography,
  Space,
  Button,
  Tag,
  message,
  Input,
} from "antd";
import { useApiUrl } from "@refinedev/core";
import { useState } from "react";
import { TicketType, TicketStatus, ITicket } from "@interfaces";

interface TicketShowModalProps {
  modalProps: ModalProps;
  data: ITicket | null;
  refetch?: () => void;
}

export const TicketShowModal: React.FC<TicketShowModalProps> = ({
  modalProps,
  data,
  refetch,
}) => {
  const apiUrl = useApiUrl();
  const [loading, setLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  if (!data) return null;

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

  const handleAction = async (action: "reject" | "complete") => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/tickets/${data.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote }),
      });

      if (!res.ok) throw new Error("Request failed");
      message.success(
        `${action === "reject" ? "Đã từ chối" : "Đã hoàn thành"} ticket`
      );
      refetch?.();
      modalProps.onCancel;
    } catch (err) {
      console.error(err);
      message.error("Xử lý thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...modalProps}
      title={`Ticket #${data.id}`}
      width={700}
      footer={null}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
        <Descriptions.Item label="Order ID">
          {data.orderId ?? "No Order"}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag color={typeColorMap[data.type]}>{data.type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={statusColorMap[data.status]}>{data.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Customer Note">
          {data.customerNote}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(data.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Admin Note">
          {data.adminNote ?? "-"}
        </Descriptions.Item>
      </Descriptions>

      <Typography.Title level={5} style={{ marginTop: 20 }}>
        Admin Note
      </Typography.Title>
      <Input.TextArea
        rows={4}
        value={adminNote}
        onChange={(e) => setAdminNote(e.target.value)}
        placeholder="Ghi chú xử lý (tuỳ chọn)"
      />

      <Space
        style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}
      >
        <Button danger loading={loading} onClick={() => handleAction("reject")}>
          Reject
        </Button>
        <Button
          type="primary"
          loading={loading}
          onClick={() => handleAction("complete")}
        >
          Complete
        </Button>
      </Space>
    </Modal>
  );
};
