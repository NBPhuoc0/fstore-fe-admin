"use client";
import { Form, Input, Modal, ModalProps, Spin } from "antd";

interface EditBrandModalProps {
  formProps: any;
  loading: boolean;
  modalProps: ModalProps;
}

export const BrandEditModal: React.FC<EditBrandModalProps> = ({
  formProps,
  loading,
  modalProps,
}) => {
  return (
    <Modal title="Edit brand" {...modalProps}>
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
