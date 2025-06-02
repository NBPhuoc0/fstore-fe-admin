"use client";

import { IProduct, IPromotion } from "@interfaces";
import { useSelect } from "@refinedev/antd";
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

  const { selectProps: PromotionSelectProps } = useSelect<IPromotion>({
    resource: "promotions",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Modal
      className="nbphuoc"
      title=" Add Product to Promotion"
      {...modalProps}
    >
      <Spin spinning={loading}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            label={"Promotion"}
            name={["id"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select {...PromotionSelectProps} />
          </Form.Item>
        </Form>

        <Form {...formProps} layout="vertical">
          <Form.Item
            label={"Product"}
            name={["id"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select {...ProductSelectProps} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
