"use client";

import { Form, Input, Modal, ModalProps, Spin } from "antd";

interface EditSizeModalProps {
  formProps: any;
  loading: boolean;
  modalProps: ModalProps;
}

export const SizeEditModal: React.FC<EditSizeModalProps> = ({
  formProps,
  loading,
  modalProps,
}) => {
  return (
    <Modal title="Edit size" {...modalProps}>
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
