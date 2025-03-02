"use client";

import { Form, Input, Modal, ModalProps, Spin } from "antd";

interface CreateColorModalProps {
  formProps: any;
  loading: boolean;
  modalProps: ModalProps;
}

export const ColorCreateModal: React.FC<CreateColorModalProps> = ({
  formProps,
  loading,
  modalProps,
}) => {
  return (
    <Modal title="Create color" {...modalProps}>
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
