"use client";

import {
  Modal,
  ModalProps,
  Descriptions,
  Typography,
  Tag,
  Spin,
  Progress,
  message,
  Button,
} from "antd";
import { useApiUrl } from "@refinedev/core";
import { useState, useEffect } from "react";

interface VoucherShowModalProps {
  modalProps: ModalProps;
  voucherId?: number;
}

export const VoucherShowModal: React.FC<VoucherShowModalProps> = ({
  modalProps,
  voucherId,
}) => {
  const apiUrl = useApiUrl();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!voucherId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/vouchers/${voucherId}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [voucherId, apiUrl]);

  const handleToggleStatus = async () => {
    if (!data) return;

    setLoading(true);
    try {
      await fetch(`${apiUrl}/vouchers/status/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !data.status }),
      });

      message.success("Cập nhật trạng thái thành công");

      // refetch lại data
      const res = await fetch(`${apiUrl}/vouchers/${data.id}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!voucherId) return null;

  return (
    <Modal {...modalProps} title="Voucher Details" width={700} footer={null}>
      <Spin spinning={loading}>
        {data ? (
          <>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
              <Descriptions.Item label="Name">{data.name}</Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={data.type === "PERCENT" ? "blue" : "orange"}>
                  {data.type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {data.status ? (
                  <Tag color="green">Active</Tag>
                ) : (
                  <Tag color="red">Inactive</Tag>
                )}
                <Button
                  size="small"
                  style={{ marginLeft: 8 }}
                  type={data.status ? "default" : "primary"}
                  loading={loading}
                  onClick={handleToggleStatus}
                >
                  {data.status ? "Tắt" : "Bật"}
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="Value">
                {data.type === "PERCENT"
                  ? `${data.value}%`
                  : `${data.value?.toLocaleString("vi-VN")} ₫`}
              </Descriptions.Item>
              <Descriptions.Item label="Max Discount">
                {data.maxDiscount
                  ? `${data.maxDiscount?.toLocaleString("vi-VN")} ₫`
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity">
                {data.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="Used Quantity">
                {data.usedQuantity}
              </Descriptions.Item>
              <Descriptions.Item label="Budget Used">
                {data.budgetUsed?.toLocaleString("vi-VN")} ₫
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(data.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {new Date(data.updatedAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Typography.Title level={5} style={{ marginTop: 24 }}>
              Usage Progress
            </Typography.Title>

            <Progress
              percent={
                data.quantity > 0
                  ? Math.round((data.usedQuantity / data.quantity) * 100)
                  : 0
              }
              status="active"
              format={(percent) => `${data.usedQuantity} / ${data.quantity}`}
            />

            <Typography.Title level={5} style={{ marginTop: 24 }}>
              Description
            </Typography.Title>
            <Typography.Paragraph>{data.description}</Typography.Paragraph>
          </>
        ) : (
          <Typography.Text>Đang tải dữ liệu...</Typography.Text>
        )}
      </Spin>
    </Modal>
  );
};
