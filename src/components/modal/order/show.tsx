"use client";
import {
  Modal,
  ModalProps,
  Typography,
  Divider,
  Descriptions,
  message,
  Button,
} from "antd";
import { useApiUrl } from "@refinedev/core";
import { useState } from "react";
interface ShowOrderModalProps {
  modalProps: ModalProps;
  data: any; // dữ liệu order truyền vào
  refetch?: () => void; // Optional: truyền vào để refetch dữ liệu sau khi update
}

export const OrderShowModal: React.FC<ShowOrderModalProps> = ({
  modalProps,
  data,
  refetch, // Mặc định là một hàm rỗng nếu không truyền vào
}) => {
  const {
    id,
    name,
    email,
    phone,
    address,
    paymentMethod,
    status,
    subTotal,
    shippingFee,
    discount,
    total,
    orderItems = [],
  } = data || {};
  const apiUrl = useApiUrl();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const handleConfirmOrder = async () => {
    setConfirmLoading(true);
    try {
      const res = await fetch(`${apiUrl}/orders/${id}/delivered`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Confirm failed");
      message.success("Đã xác nhận giao hàng!");
      refetch?.();
      modalProps.onCancel; // Đóng modal sau khi thành công
    } catch (error) {
      console.error(error);
      message.error("Xác nhận thất bại!");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch(`${apiUrl}/orders/${id}/cancel`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Cancel failed");
      message.success("Đã huỷ đơn hàng!");
      refetch?.();
      modalProps.onCancel; // Đóng modal sau khi thành công
    } catch (error) {
      console.error(error);
      message.error("Huỷ đơn thất bại!");
    } finally {
      setCancelLoading(false);
    }
  };
  return (
    <Modal
      title="Order details"
      {...modalProps}
      width={800}
      footer={[
        <Button
          key="cancel"
          danger
          onClick={handleCancelOrder}
          loading={cancelLoading}
        >
          Huỷ đơn
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirmOrder}
          loading={confirmLoading}
        >
          Xác nhận giao
        </Button>,
      ]}
    >
      <Descriptions
        bordered
        column={2}
        size="middle"
        style={{ marginBottom: 24 }}
      >
        <Descriptions.Item label="Order ID">{id}</Descriptions.Item>
        <Descriptions.Item label="Status">{status}</Descriptions.Item>
        <Descriptions.Item label="Customer Name">{name}</Descriptions.Item>
        <Descriptions.Item label="Email">{email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{phone}</Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {address}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Method">
          {paymentMethod}
        </Descriptions.Item>
        <Descriptions.Item label="Subtotal">
          {subTotal?.toLocaleString("vi-VN")} ₫
        </Descriptions.Item>
        <Descriptions.Item label="Shipping Fee">
          {shippingFee?.toLocaleString("vi-VN")} ₫
        </Descriptions.Item>
        <Descriptions.Item label="Discount">
          {discount?.toLocaleString("vi-VN")} ₫
        </Descriptions.Item>
        <Descriptions.Item label="Total">
          <strong>{total?.toLocaleString("vi-VN")} ₫</strong>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Order Items</Divider>

      {orderItems.length > 0 ? (
        orderItems.map((item: any, index: number) => (
          <div
            key={item.id}
            style={{
              padding: "12px",
              border: "1px solid #f0f0f0",
              borderRadius: 6,
              marginBottom: 12,
            }}
          >
            <Typography.Text strong>
              #{index + 1} - Product ID: {item.productId}, Variant ID:{" "}
              {item.variantId}
            </Typography.Text>
            <br />
            <Typography.Text>Quantity: {item.quantity}</Typography.Text>
            <br />
            <Typography.Text>
              Unit Price: {item.unitPrice?.toLocaleString("vi-VN")} ₫
            </Typography.Text>
          </div>
        ))
      ) : (
        <Typography.Text type="secondary">No items found.</Typography.Text>
      )}
    </Modal>
  );
};
