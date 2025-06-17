"use client";

import {
  Form,
  Input,
  Modal,
  ModalProps,
  Select,
  Spin,
  Upload,
  Button,
  message,
  FormProps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useApiUrl } from "@refinedev/core";
import { useState } from "react";
import { FormInstance } from "antd/lib";

interface CreateVoucherModalProps {
  formProps: FormProps;
  loading: boolean;
  modalProps: ModalProps;
}

export const VoucherCreateModal: React.FC<CreateVoucherModalProps> = ({
  formProps,
  loading,
  modalProps,
}) => {
  const apiUrl = useApiUrl();
  const [submitLoading, setSubmitLoading] = useState(false);

  const test = async () => {
    console.log("test");
    const values = await formProps.form?.validateFields();
    console.log("values: ", values.file[0].name);

    // const formData = new FormData();

    // formData.append("file", values.file.file[0].originFileObj);
  };

  const handleSubmit = async () => {
    try {
      const values = await formProps.form?.validateFields();
      const formData = new FormData();

      formData.append("file", values.file[0].originFileObj);
      formData.append("name", values.name || "");
      formData.append("description", values.description || "");
      formData.append("type", values.type || "");
      formData.append("value", values.value?.toString() || "");
      formData.append("quantity", values.quantity?.toString() || "");
      if (values.type === "PERCENT") {
        formData.append("maxDiscount", values.maxDiscount?.toString() || "");
      }
      formData.append("createdBy", values.createdBy || "");

      setSubmitLoading(true);

      await fetch(`${apiUrl}/vouchers`, {
        method: "POST",
        body: formData,
      });

      message.success("Tạo voucher thành công");
      modalProps.onCancel;
      formProps.form?.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Tạo voucher thất bại");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Modal
      title="Create Voucher"
      {...modalProps}
      confirmLoading={submitLoading}
    >
      <Spin spinning={loading}>
        <Form {...formProps} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true }]}
            initialValue="PERCENT"
          >
            <Select
              options={[
                { label: "Percent", value: "PERCENT" },
                { label: "Amount", value: "AMOUNT" },
              ]}
              placeholder="Select voucher type"
            />
          </Form.Item>
          {/* Logic Max Discount */}
          <Form.Item shouldUpdate>
            {() => {
              const type = formProps.form?.getFieldValue("type");
              return (
                <Form.Item
                  label="Max Discount"
                  name="maxDiscount"
                  rules={
                    type === "PERCENT"
                      ? [
                          {
                            required: true,
                            message:
                              "Bắt buộc nhập Max Discount với loại Percent",
                          },
                        ]
                      : []
                  }
                >
                  <Input type="number" disabled={type !== "PERCENT"} />
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item
            label="Value"
            name="value"
            rules={[{ required: true }]}
            initialValue={12000}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true }]}
            initialValue={10}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Upload Image"
            name="file"
            valuePropName="file"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: "Vui lòng chọn file" }]}
          >
            <Upload
              beforeUpload={(file) => {
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
