"use client";

import { IProduct, IPromotion } from "@interfaces";
import { TextField, useSelect } from "@refinedev/antd";
import { Form, Input, Modal, ModalProps, Select, Spin } from "antd";

interface AddProduct2PromotionModalProps {
  formProps: any;
  loading: boolean;
  modalProps: ModalProps;
}

export const AddProductToPromotionModal: React.FC<
  AddProduct2PromotionModalProps
> = ({ formProps, loading, modalProps }) => {
  const { selectProps: ProductSelectProps } = useSelect<IProduct>({
    resource: "products",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Modal title=" Add Product to Promotion" {...modalProps}>
      <Spin spinning={loading}>
        <Form {...formProps} layout="vertical">
          <Form.Item label={"Promotion"} name={["name"]}>
            <Input />
          </Form.Item>

          <Form.Item
            label={"Product"}
            name={["productIds"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              {...ProductSelectProps}
              mode="multiple"
              placeholder="Select products"
              showSearch
              filterOption={(input, option) =>
                ((option?.label as string) ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {ProductSelectProps.options?.map((option) => (
                <Select.Option value={option.value}>
                  {option.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
