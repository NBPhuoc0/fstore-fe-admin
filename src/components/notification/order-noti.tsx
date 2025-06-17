// components/OrderNotificationClient.tsx
"use client";

import { ShoppingCartOutlined } from "@ant-design/icons";
import { formatVND } from "@components/helper";
import { notification } from "antd";
import { useEffect } from "react";

export const OrderNotificationClient = () => {
  const apiUrl = "https://api.nbphuoc.xyz/admin"; // Thay thế bằng URL API thực tế

  useEffect(() => {
    const sse = new EventSource(`${apiUrl}/orders/stream`);

    sse.onmessage = (event) => {
      try {
        const order = JSON.parse(event.data);

        notification.open({
          message: (
            <span style={{ fontWeight: 600, fontSize: 16 }}>Đơn hàng mới!</span>
          ),
          description: (
            <div>
              <div>
                <strong>Khách hàng:</strong> {order.name}
              </div>
              <div>
                <strong>Tổng tiền:</strong> {formatVND(order.total)}
              </div>
            </div>
          ),
          icon: <ShoppingCartOutlined style={{ color: "#1890ff" }} />,
          duration: null,
        });
      } catch (err) {
        console.error("Lỗi parse SSE:", err);
      }
    };

    sse.onerror = (err) => {
      console.warn("SSE connection error:", err);
    };

    return () => {
      sse.close();
    };
  }, []);

  return null; // Không render gì, chỉ để chạy hook
};
