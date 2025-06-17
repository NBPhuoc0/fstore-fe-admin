"use client";

import { Modal, Form, InputNumber, Input, message } from "antd";
import { useApiUrl } from "@refinedev/core";
import { useState } from "react";

interface AdjustStockModalProps {
  open: boolean;
  onClose: () => void;
  variantId: number;
  onSuccess?: () => void;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({
  open,
  onClose,
  variantId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const apiUrl = useApiUrl();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const res = await fetch(`${apiUrl}/inventory/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, ...values }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Đã xảy ra lỗi khi xử lý yêu cầu");
      }

      message.success("Nhập kho thành công");
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      message.error("Nhập kho thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Adjust Stock"
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please enter quantity" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Note" name="note">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
