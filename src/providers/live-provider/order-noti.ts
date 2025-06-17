import React, { useEffect } from "react";
import { notification } from "antd";
import { useApiUrl } from "@refinedev/core";
import { SmileOutlined } from "@ant-design/icons";

export const useOrderSseNotification = () => {
  const apiUrl = useApiUrl();

  useEffect(() => {
    const eventSource = new EventSource(`${apiUrl}/orders/stream`);

    eventSource.onmessage = (event) => {
      try {
        const order = JSON.parse(event.data);

        notification.open({
          message: "Đơn hàng mới!",
          description: `Khách hàng: ${order.name} - Tổng tiền: ${order.total} VNĐ`,
        });
      } catch (err) {
        console.error("Lỗi parse SSE:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [apiUrl]);
};
