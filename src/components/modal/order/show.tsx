"use client";
import {
  Modal,
  ModalProps,
  Typography,
  Divider,
  Descriptions,
  message,
  Button,
  Tag,
  Space,
} from "antd";
import { useApiUrl } from "@refinedev/core";
import { useState } from "react";

interface ShowOrderModalProps {
  modalProps: ModalProps;
  data: any;
  refetch?: () => void;
}

export const OrderShowModal: React.FC<ShowOrderModalProps> = ({
  modalProps,
  data,
  refetch,
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
    shippingRef,
    orderItems = [],
  } = data || {};
  const apiUrl = useApiUrl();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/orders/${id}/${action}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`${action} failed`);
      message.success(`${action} success!`);
      refetch?.();
      modalProps.onCancel;
    } catch (err) {
      console.error(err);
      message.error(`${action} failed!`);
    } finally {
      setLoading(false);
    }
  };

  const renderFooterButtons = () => {
    const buttons: JSX.Element[] = [];

    if (status === "PROCESSING") {
      buttons.push(
        <Button
          key="confirm-delivered"
          type="primary"
          loading={loading}
          onClick={() => handleAction("delivered")}
        >
          Xác nhận giao hàng
        </Button>
      );

      buttons.push(
        <Button
          key="cancel"
          danger
          loading={loading}
          onClick={() => handleAction("cancel")}
        >
          Huỷ đơn
        </Button>
      );
    }

    if (status === "DELIVERED") {
      buttons.push(
        <Button
          key="track"
          type="primary"
          onClick={() =>
            window.open(
              `https://tracking.ghn.dev/?order_code=${shippingRef}`,
              "_blank"
            )
          }
        >
          Xem trạng thái vận chuyển
        </Button>
      );
    }

    if (status === "COMPLETED") {
      buttons.push(
        <Button
          key="return"
          type="primary"
          loading={loading}
          onClick={() => handleAction("return")}
        >
          Trả hàng
        </Button>
      );
    }

    if (status === "WAITTING_REFUND") {
      buttons.push(
        <Button
          key="refund"
          type="primary"
          danger
          loading={loading}
          onClick={() => handleAction("refund")}
        >
          Xác nhận hoàn tiền
        </Button>
      );
    }

    return buttons;
  };

  const statusColorMap: Record<string, string> = {
    PENDING: "red",
    PROCESSING: "orange",
    DELIVERED: "green",
    COMPLETED: "blue",
    CANCELLED: "gray",
    RETURNED: "purple",
    REFUNDED: "cyan",
    WAITTING_REFUND: "volcano",
  };

  return (
    <Modal
      title="Chi tiết đơn hàng"
      {...modalProps}
      width={850}
      footer={renderFooterButtons()}
    >
      <Descriptions
        bordered
        column={2}
        size="middle"
        style={{ marginBottom: 24 }}
      >
        <Descriptions.Item label="Mã đơn">{id}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={statusColorMap[status] || "default"}>{status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng">{name}</Descriptions.Item>
        <Descriptions.Item label="Email">{email}</Descriptions.Item>
        <Descriptions.Item label="SĐT">{phone}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ" span={2}>
          {address}
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">
          {paymentMethod}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tạm tính">
          {subTotal?.toLocaleString("vi-VN")} ₫
        </Descriptions.Item>
        <Descriptions.Item label="Phí vận chuyển">
          {shippingFee?.toLocaleString("vi-VN")} ₫
        </Descriptions.Item>
        <Descriptions.Item label="Giảm giá">
          {discount?.toLocaleString("vi-VN")} ₫
        </Descriptions.Item>
        <Descriptions.Item label="Tổng cộng">
          <Typography.Text strong style={{ fontSize: 16, color: "#d4380d" }}>
            {total?.toLocaleString("vi-VN")} ₫
          </Typography.Text>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Danh sách sản phẩm</Divider>

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {orderItems.length > 0 ? (
          orderItems.map((item: any, index: number) => (
            <div
              key={item.id}
              style={{
                padding: "16px",
                border: "1px solid #f0f0f0",
                borderRadius: 10,
                background: "#fafafa",
              }}
            >
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Typography.Text strong>
                  #{index + 1} - Product ID: {item.productId}, Variant ID:{" "}
                  {item.variantId}
                </Typography.Text>
                <Typography.Text>Số lượng: {item.quantity}</Typography.Text>
                <Typography.Text>
                  Đơn giá: {item.product.originalPrice?.toLocaleString("vi-VN")}{" "}
                  ₫
                </Typography.Text>
              </Space>
            </div>
          ))
        ) : (
          <Typography.Text type="secondary">
            Không có sản phẩm nào.
          </Typography.Text>
        )}
      </Space>
    </Modal>
  );
};
