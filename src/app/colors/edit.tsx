import { IColor } from "@interfaces";
import { useModalForm } from "@refinedev/antd";
import { Form, Input, Modal } from "antd";

export const EditColor: React.FC = () => {
  const { formProps, modalProps } = useModalForm<IColor>({
    action: "edit",
    resource: "colors",
  });

  return (
    <Modal {...modalProps}>
      <Form {...formProps}>
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
