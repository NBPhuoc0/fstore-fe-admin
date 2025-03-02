"use client";
import { Form, Input, Modal, ModalProps, Spin } from "antd";

interface CreateBrandModalProps {
  formProps: any;
  loading: boolean;
  modalProps: ModalProps;
}

export const BrandCreateModal: React.FC<CreateBrandModalProps> = ({
  formProps,
  loading,
  modalProps,
}) => {
  return (
    <Modal title="Create brand" {...modalProps}>
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
