"use client";

import {
  Button,
  Popconfirm,
  Space,
  message,
  Modal,
  Checkbox,
  Form,
  InputNumber,
} from "antd";
import { useApiUrl } from "@refinedev/core";
import { useState } from "react";

interface OrderActionsProps {
  id: number;
  status: string;
  orderItems?: any[]; // orderItems cần để lấy danh sách sản phẩm khi exchange
  onSuccess?: () => void;
}

export const OrderActions: React.FC<OrderActionsProps> = ({
  id,
  status,
  orderItems = [],
  onSuccess,
}) => {
  const apiUrl = useApiUrl();
  const [loading, setLoading] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [exchangeQuantities, setExchangeQuantities] = useState<{
    [key: number]: number;
  }>({});

  const callApi = async (endpoint: string, dto?: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: dto ? { "Content-Type": "application/json" } : undefined,
        body: dto ? JSON.stringify(dto) : undefined,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Đã xảy ra lỗi khi xử lý yêu cầu");
      }
      message.success("Thành công");
      onSuccess?.();
    } catch {
      message.error("Lỗi");
    } finally {
      setLoading(false);
    }
  };

  const actions: JSX.Element[] = [];

  // Các trạng thái cũ giữ nguyên
  if (status === "PROCESSING") {
    actions.push(
      <Popconfirm
        key="deliver"
        title="Xác nhận Deliver?"
        onConfirm={() => callApi(`/orders/delivering/${id}`)}
      >
        <Button size="small" type="primary" loading={loading}>
          Deliver
        </Button>
      </Popconfirm>
    );
  }

  if (status === "DELIVERING") {
    actions.push(
      <Popconfirm
        key="complete"
        title="Xác nhận Complete?"
        onConfirm={() => callApi(`/orders/completed/${id}`)}
      >
        <Button size="small" type="primary" loading={loading}>
          Complete
        </Button>
      </Popconfirm>
    );
  }

  if (["PENDING", "PROCESSING"].includes(status)) {
    actions.push(
      <Popconfirm
        key="cancel"
        title="Xác nhận Cancel?"
        onConfirm={() => callApi(`/orders/cancel/uncompleted/${id}`)}
      >
        <Button size="small" danger loading={loading}>
          Cancel
        </Button>
      </Popconfirm>
    );
  }

  if (status === "COMPLETED") {
    actions.push(
      <Popconfirm
        key="returnRequest"
        title="Yêu cầu Return?"
        onConfirm={() => callApi(`/orders/return/request/${id}`)}
      >
        <Button size="small" loading={loading}>
          Return Request
        </Button>
      </Popconfirm>
    );
  }

  if (status === "RETURN_PROCESSING") {
    actions.push(
      <Popconfirm
        key="processReturn"
        title="Xử lý Return?"
        onConfirm={() => callApi(`/orders/return/process/${id}`)}
      >
        <Button size="small" loading={loading}>
          Process Return
        </Button>
      </Popconfirm>
    );
  }

  if (status === "WAITING_REFUND") {
    actions.push(
      <Popconfirm
        key="refund"
        title="Xác nhận Refund?"
        onConfirm={() => callApi(`/orders/refund/${id}`)}
      >
        <Button size="small" loading={loading}>
          Refund
        </Button>
      </Popconfirm>
    );
  }

  // ✅ Trạng thái mới RETURNED
  if (status === "RETURNED") {
    actions.push(
      <Button
        key="exchange"
        size="small"
        type="primary"
        onClick={() => setExchangeModalOpen(true)}
      >
        Exchange
      </Button>
    );

    actions.push(
      <Popconfirm
        key="cancelCompleted"
        title="Xác nhận Cancel đơn hoàn trả?"
        onConfirm={() => callApi(`/orders/return/complete`, { orderId: id })}
      >
        <Button size="small" danger loading={loading}>
          Cancel Order
        </Button>
      </Popconfirm>
    );
  }

  // Modal Exchange
  const handleExchange = async () => {
    const items = Object.entries(exchangeQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => {
        const item = orderItems.find((i) => i.id === Number(itemId));
        return {
          productId: item.productId,
          variantId: item.variantId,
          quantity: qty,
        };
      });

    if (items.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 sản phẩm cần đổi");
      return;
    }

    await callApi(`/orders/return/exchange`, {
      orderId: id,
      items,
    });

    setExchangeModalOpen(false);
    setExchangeQuantities({});
  };

  return (
    <>
      <Space>{actions}</Space>

      <Modal
        open={exchangeModalOpen}
        title="Chọn sản phẩm và số lượng cần đổi"
        onOk={handleExchange}
        onCancel={() => setExchangeModalOpen(false)}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          {orderItems.map((item) => (
            <Form.Item
              key={item.id}
              label={`${item.product?.name} (Qty: ${item.quantity})`}
            >
              <InputNumber
                min={0}
                max={item.quantity}
                value={exchangeQuantities[item.id] || 0}
                onChange={(val) => {
                  setExchangeQuantities((prev) => ({
                    ...prev,
                    [item.id]: val,
                  }));
                }}
              />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  );
};
