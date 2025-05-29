"use client";
import { useSelect } from "@refinedev/antd";
import { Form, Input, Modal, ModalProps, Select, Spin } from "antd";

interface CreateCategoryModalProps {
  formProps: any;
  loading: boolean;
  modalProps: ModalProps;
}

export const CategoryCreateModal: React.FC<CreateCategoryModalProps> = ({
  formProps,
  loading,
  modalProps,
}) => {
  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Modal title="Create category" {...modalProps}>
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
          <Form.Item label={"Parent"} name={["parent"]}>
            <Select {...categorySelectProps} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
