"use client";

import { Modal, Form, Upload, Button, message, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useApiUrl } from "@refinedev/core";
import { useState } from "react";

interface InventoryBulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  type: "import" | "adjust";
  onSuccess?: () => void;
}

export const InventoryBulkUploadModal: React.FC<
  InventoryBulkUploadModalProps
> = ({ open, onClose, type, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const apiUrl = useApiUrl();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("file", values.file[0].originFileObj);
      if (values.note) {
        formData.append("note", values.note);
      }

      setLoading(true);
      const endpoint =
        type === "import"
          ? `${apiUrl}/inventory/import/bulk`
          : `${apiUrl}/inventory/adjust/bulk`;

      await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      message.success(`${type === "import" ? "Import" : "Adjust"} thành công`);
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      message.error(`${type === "import" ? "Import" : "Adjust"} thất bại`);
    } finally {
      setLoading(false);
    }
  };

  const test = async () => {
    const values = await form.validateFields();
    console.log(JSON.stringify(values.file[0].name));
  };

  return (
    <Modal
      open={open}
      title={type === "import" ? "Import Bulk Stock" : "Adjust Bulk Stock"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="file"
          label="Excel File"
          rules={[{ required: true, message: "Vui lòng chọn file excel" }]}
          valuePropName="file"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="note" label="Note (optional)">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
