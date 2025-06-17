"use client";

import { OrderActions } from "@components/action/order-action";
import { formatVND } from "@components/helper";
import {
  Modal,
  ModalProps,
  Descriptions,
  Divider,
  Typography,
  Tag,
  Table,
  Image,
  Space,
} from "antd";

interface OrderDetailModalProps {
  modalProps: ModalProps;
  data: any;
  onRefetch?: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  modalProps,
  data,
  onRefetch,
}) => {
  if (!data) return null;

  const {
    id,
    status,
    name,
    email,
    address,
    phone,
    paymentMethod,
    paymentRef,
    shippingRef,
    shippingFee,
    subTotal,
    discount,
    total,
    createdAt,
    orderItems = [],
  } = data;

  return (
    <Modal {...modalProps} title={`Order #${id}`} width={900}>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="Order ID">{id}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(status)}>{status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Customer Name">{name}</Descriptions.Item>
        <Descriptions.Item label="Email">{email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{phone}</Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {address}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Method">
          {paymentMethod}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Ref">
          {paymentRef ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Shipping Ref">
          {shippingRef ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Subtotal">
          {formatVND(subTotal)}
        </Descriptions.Item>
        <Descriptions.Item label="Shipping Fee">
          {formatVND(shippingFee)}
        </Descriptions.Item>
        <Descriptions.Item label="Discount">
          {formatVND(discount)}
        </Descriptions.Item>
        <Descriptions.Item label="Total">{formatVND(total)}</Descriptions.Item>
        <Descriptions.Item label="Created At" span={2}>
          {new Date(createdAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Order Items</Divider>

      <Table
        dataSource={orderItems}
        rowKey={(record) => record.id}
        pagination={false}
        bordered
        size="small"
      >
        <Table.Column
          title="Product"
          render={(_, record: any) => {
            const product = record.product;
            const photoUrl = product?.photos?.[0]?.url;

            return (
              <Space>
                <Image
                  src={photoUrl}
                  width={60}
                  height={60}
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <Typography.Text strong>{product.name}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary">
                    Code: {product.code}
                  </Typography.Text>
                </div>
              </Space>
            );
          }}
        />
        <Table.Column title="Quantity" dataIndex="quantity" align="center" />
        <Table.Column
          title="Original Price"
          render={(_, record: any) => {
            const price = record.product?.originalPrice;
            return formatVND(price);
          }}
          align="right"
        />
        <Table.Column
          title="Total"
          render={(_, record: any) => {
            const price = record.product?.originalPrice;
            const qty = record.quantity;
            return formatVND(price * qty);
          }}
          align="right"
        />
      </Table>
      <Divider orientation="left">State Actions</Divider>

      <OrderActions
        id={id}
        status={status}
        onSuccess={onRefetch}
        orderItems={orderItems}
      />
    </Modal>
  );
};

// ✅ Helper function đổi màu status
const getStatusColor = (status: string) => {
  switch (status) {
    case "CANCELLED":
      return "red";
    case "COMPLETED":
      return "green";
    case "PENDING":
      return "orange";
    case "DELIVERING":
      return "blue";
    case "RETURN_PROCESSING":
      return "purple";
    case "WAITING_REFUND":
      return "magenta";
    default:
      return "default";
  }
};
