"use client";

import { Modal, Form, InputNumber, Input, message } from "antd";
import { useApiUrl } from "@refinedev/core";
import { useState } from "react";

interface ImportStockModalProps {
  open: boolean;
  onClose: () => void;
  variantId: number;
  onSuccess?: () => void;
}

export const ImportStockModal: React.FC<ImportStockModalProps> = ({
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

      await fetch(`${apiUrl}/inventory/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, ...values }),
      });

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
      title="Import Stock"
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

        <Form.Item label="Price" name="price">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Note" name="note">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
