"use client";

import { Form, Input, Modal, ModalProps, Select, Spin } from "antd";

interface CreatePromotionModalProps {
  formProps: any;
  loading: boolean;
  modalProps: ModalProps;
}

export const PromotionCreateModal: React.FC<CreatePromotionModalProps> = ({
  formProps,
  loading,
  modalProps,
}) => {
  return (
    <Modal className="nbphuoc2" title="Create size" {...modalProps}>
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
          <Form.Item
            label={"Description"}
            name={["description"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Type"}
            name={["type"]}
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={"PERCENT"}
          >
            <Select
              options={[
                { label: "Percent", value: "PERCENT" },
                { label: "Amount", value: "AMOUNT" },
                { label: "Flat", value: "FLAT" },
              ]}
              placeholder="Select promotion type"
            />
          </Form.Item>
          <Form.Item
            label={"Max Discount"}
            name={["maxDiscount"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label={"Value"}
            name={["value"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label={"Start date"}
            name={["startDate"]}
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={"2025-04-22"}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            label={"End date"}
            name={["endDate"]}
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={"2025-08-06"}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
