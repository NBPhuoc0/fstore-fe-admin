"use client";

import { Form, Input, Modal, ModalProps, Spin } from "antd";

interface EditColorModalProps {
  formProps: any;
  loading: boolean;
  modalProps: ModalProps;
}

export const ColorEditModal: React.FC<EditColorModalProps> = ({
  formProps,
  loading,
  modalProps,
}) => {
  return (
    <Modal title="Edit color" {...modalProps}>
      <Spin spinning={loading}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            label={"Name"}
            name={["name"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
