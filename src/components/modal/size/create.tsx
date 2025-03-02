"use client";

import { Form, Input, message, Modal, ModalProps, Spin } from "antd";

interface CreateSizeModalProps {
  formProps: any;
  loading: boolean;
  modalProps: ModalProps;
}

export const SizeCreateModal: React.FC<CreateSizeModalProps> = ({
  formProps,
  loading,
  modalProps,
}) => {
  return (
    <Modal title="Create size" {...modalProps}>
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
