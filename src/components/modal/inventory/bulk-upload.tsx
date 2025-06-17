"use client";

import { Modal, Form, Upload, Button, message, Input, InputNumber } from "antd";
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
      formData.append("supplierName", values.supplierName || "");
      formData.append("note", values.note || "");
      formData.append("incidentalCosts", values.incidentalCosts || "0");
      formData.append("createdBy", values.createdBy || "");

      setLoading(true);
      const endpoint =
        type === "import"
          ? `${apiUrl}/inventory/import/bulk`
          : `${apiUrl}/inventory/adjust/bulk`;

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Đã xảy ra lỗi khi xử lý yêu cầu");
      }
      message.success(`${type === "import" ? "Import" : "Adjust"} thành công`);
      onClose();
      onSuccess?.();
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error(`${type === "import" ? "Import" : "Adjust"} thất bại`);
    } finally {
      setLoading(false);
    }
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

        <Form.Item name="supplierName" label="Supplier Name" required>
          <Input placeholder="Nhập nhà cung cấp" />
        </Form.Item>

        <Form.Item name="note" label="Note">
          <Input.TextArea rows={2} placeholder="Ghi chú thêm (nếu có)" />
        </Form.Item>

        <Form.Item name="incidentalCosts" label="Incidental Costs" required>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item name="createdBy" label="Created By" required>
          <Input placeholder="Người tạo phiếu" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
