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
  const [submitting, setSubmitting] = useState(false);
  const apiUrl = useApiUrl();

  const isImport = type === "import";

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const file = values.file?.[0]?.originFileObj;

      if (!file) {
        message.error("Vui lòng chọn file hợp lệ");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("note", values.note || "");

      if (isImport) {
        formData.append("supplierName", values.supplierName || "");
        formData.append("incidentalCosts", values.incidentalCosts || "0");
        formData.append("createdBy", values.createdBy || "");
      }

      // 👇 Đóng modal sớm
      onClose();
      form.resetFields();

      // 👇 Hiện message 'đang xử lý...'
      const key = "bulk-upload";
      message.open({
        key,
        type: "loading",
        content: "Đang xử lý dữ liệu...",
        duration: 0, // Đừng tự động tắt
      });

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

      // 👇 Cập nhật lại message thành công
      message.open({
        key,
        type: "success",
        content: `${isImport ? "Import" : "Adjust"} thành công!`,
      });

      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      message.open({
        key: "bulk-upload",
        type: "error",
        content: err.message || "Thao tác thất bại!",
      });
    }
  };

  return (
    <Modal
      open={open}
      title={isImport ? "Import Bulk Stock" : "Adjust Bulk Stock"}
      onCancel={onClose}
      onOk={handleSubmit}
      okButtonProps={{ loading: submitting }}
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
            <Button icon={<UploadOutlined />}>Chọn File</Button>
          </Upload>
        </Form.Item>

        {isImport && (
          <Form.Item
            name="supplierName"
            label="Nhà cung cấp"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nhập tên nhà cung cấp" />
          </Form.Item>
        )}

        <Form.Item
          name="note"
          label="Ghi chú"
          rules={[{ required: !isImport }]}
        >
          <Input.TextArea rows={2} placeholder="Ghi chú thêm (nếu có)" />
        </Form.Item>

        {isImport && (
          <>
            <Form.Item
              name="incidentalCosts"
              label="Chi phí phát sinh"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item
              name="createdBy"
              label="Người tạo phiếu"
              rules={[{ required: true }]}
            >
              <Input placeholder="Tên người tạo" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};
