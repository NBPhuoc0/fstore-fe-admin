"use client";

import { MessageOutlined } from "@ant-design/icons";
import { useApiUrl } from "@refinedev/core";
import { notification, Tag } from "antd";
import { useEffect } from "react";

interface TicketData {
  id: number;
  email: string;
  orderId: number;
  type: "COMPLAINT" | "QUESTION" | "REQUEST" | string;
  customerNote: string;
  adminNote?: string | null;
  status: string;
  createdAt: string;
}

export const TicketNotificationClient = () => {
  const apiUrl = useApiUrl("default");

  useEffect(() => {
    const sse = new EventSource(`${apiUrl}/tickets/stream`);

    sse.onmessage = (event) => {
      try {
        const ticket: TicketData = JSON.parse(event.data);

        notification.open({
          message: (
            <span style={{ fontWeight: 600, fontSize: 16 }}>
              Yêu cầu hỗ trợ mới!
            </span>
          ),
          description: (
            <div>
              <div>
                <strong>Email:</strong> {ticket.email}
              </div>
              <div>
                <strong>Loại:</strong>{" "}
                <Tag color="blue" style={{ marginLeft: 4 }}>
                  {ticket.type}
                </Tag>
              </div>
              <div>
                <strong>Nội dung:</strong> {ticket.customerNote}
              </div>
              {ticket.orderId > 0 && (
                <div>
                  <strong>Liên quan đơn hàng:</strong> #{ticket.orderId}
                </div>
              )}
            </div>
          ),
          icon: <MessageOutlined style={{ color: "#faad14" }} />,
          duration: null,
        });
      } catch (err) {
        console.error("Lỗi parse SSE Ticket:", err);
      }
    };

    sse.onerror = (err) => {
      console.warn("Ticket SSE connection error:", err);
    };

    return () => {
      sse.close();
    };
  }, []);

  return null;
};
