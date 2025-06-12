"use client";

import {
  Modal,
  ModalProps,
  Descriptions,
  Divider,
  Typography,
  Table,
  Image,
  Tag,
  message,
  Button,
  Popconfirm,
} from "antd";
import { useApiUrl } from "@refinedev/core";
import { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { ImportStockModal } from "./import-stock";

interface ProductShowModalProps {
  modalProps: ModalProps;
  data: any;
  onRefetch: () => void; // để reload lại data sau khi update
}

export const ProductShowModal: React.FC<ProductShowModalProps> = ({
  modalProps,
  data,
  onRefetch,
}) => {
  const apiUrl = useApiUrl();
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [importVariantId, setImportVariantId] = useState<number | null>(null);

  if (!data) return null;
  const handleToggleDisplay = async () => {
    setLoadingToggle(true);
    try {
      await fetch(`${apiUrl.replace(/\/$/, "")}/products/display/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ display: !display }),
        redirect: "follow", // ensure fetch follows redirects
      });

      onRefetch?.();
      message.success(`Đã ${!display ? "hiển thị" : "ẩn"} sản phẩm`);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi cập nhật trạng thái");
    } finally {
      setLoadingToggle(false);
    }
  };

  const {
    id,
    code,
    name,
    metaDesc,
    display,
    originalPrice,
    salePrice,
    createdDate,
    updatedDate,
    category,
    brand,
    viewCount,
    saleCount,
    photos = [],
    variants = [],
    sizes = [],
    colors = [],
  } = data;

  return (
    <Modal {...modalProps} title="Product Details" width={900} footer={null}>
      <div style={{ marginBottom: 16 }}>
        <Popconfirm
          title={`Xác nhận ${display ? "ẩn" : "hiện"} sản phẩm?`}
          onConfirm={handleToggleDisplay}
          okText="Xác nhận"
          cancelText="Huỷ"
        >
          <Button
            size="small"
            type={display ? "default" : "primary"}
            icon={display ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            loading={loadingToggle}
          >
            {display ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}
          </Button>
        </Popconfirm>
      </div>
      <Descriptions bordered size="small" column={2}>
        <Descriptions.Item label="ID">{id}</Descriptions.Item>
        <Descriptions.Item label="Code">{code}</Descriptions.Item>
        <Descriptions.Item label="Name" span={2}>
          {name}
        </Descriptions.Item>
        <Descriptions.Item label="Category">{category?.name}</Descriptions.Item>
        <Descriptions.Item label="Brand">{brand?.name}</Descriptions.Item>
        <Descriptions.Item label="Original Price">
          {Number(originalPrice).toLocaleString("vi-VN")} ₫
        </Descriptions.Item>
        <Descriptions.Item label="Sale Price">
          {salePrice ? `${Number(salePrice).toLocaleString("vi-VN")} ₫` : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Display">
          {display ? "Yes" : "No"}
        </Descriptions.Item>
        {/* <Descriptions.Item label="In Stock">
          {inventoryStatus ? "In Stock" : "Out of Stock"}
        </Descriptions.Item> */}
        <Descriptions.Item label="View Count">{viewCount}</Descriptions.Item>
        <Descriptions.Item label="Sale Count">{saleCount}</Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(createdDate).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {new Date(updatedDate).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Description</Divider>
      <Typography.Paragraph>{metaDesc}</Typography.Paragraph>

      <Divider orientation="left">Photos</Divider>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {photos.map((photo: any) => (
          <Image key={photo.id} src={photo.url} width={150} />
        ))}
      </div>

      <Divider orientation="left">Variants</Divider>
      <Table
        dataSource={variants}
        rowKey="id"
        pagination={false}
        bordered
        size="small"
      >
        <Table.Column title="Variant Code" dataIndex="code" />
        <Table.Column
          title="Size"
          dataIndex="sizeId"
          render={(sizeId) => {
            const size = sizes.find((s: any) => s.id === sizeId);
            return size ? size.name : sizeId;
          }}
        />
        <Table.Column
          title="Color"
          dataIndex="colorId"
          render={(colorId) => {
            const color = colors.find((c: any) => c.id === colorId);
            return color ? color.name : colorId;
          }}
        />
        <Table.Column
          title="In Stock"
          dataIndex={["inventory", "stockQuantity"]}
          render={(data) =>
            data > 0 ? (
              <Tag color="green">In Stock</Tag>
            ) : (
              <Tag color="red">Out</Tag>
            )
          }
        />
        <Table.Column
          title="Stock Quantity"
          dataIndex={["inventory", "stockQuantity"]}
        />
        <Table.Column
          title="Actions"
          render={(_, record) => (
            <Button
              size="small"
              type="primary"
              onClick={() => setImportVariantId(record.id)}
            >
              Import
            </Button>
          )}
        />
      </Table>
      <ImportStockModal
        open={!!importVariantId}
        variantId={importVariantId!}
        onClose={() => setImportVariantId(null)}
        onSuccess={onRefetch}
      />
    </Modal>
  );
};
