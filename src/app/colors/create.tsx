"use client";
import { IColor } from "@interfaces";
import { useModalForm } from "@refinedev/antd";
import { Form, Input, Modal } from "antd";

export default function CreateColor() {
  const { formProps, modalProps } = useModalForm<IColor>({
    action: "create",
    resource: "colors",
  });

  return (
    <Modal {...modalProps}>
      <Form {...formProps}>
        <Form.Item label={"Name"} name={"name"} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
