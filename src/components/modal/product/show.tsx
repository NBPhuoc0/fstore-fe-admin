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
  Spin,
  Space,
  InputNumber,
} from "antd";
import { useApiUrl } from "@refinedev/core";
import { useState, useEffect } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { AdjustStockModal } from "./import-stock";

interface ProductShowModalProps {
  modalProps: ModalProps;
  productId?: number;
  onRefetch: () => void;
}

export const ProductShowModal: React.FC<ProductShowModalProps> = ({
  modalProps,
  productId,
  onRefetch,
}) => {
  const apiUrl = useApiUrl();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [AdjustVariantId, setAdjustVariantId] = useState<number | null>(null);
  const [editPriceModalOpen, setEditPriceModalOpen] = useState(false);
  const [newPrice, setNewPrice] = useState<number>(0);

  // Fetch product data by productId
  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/products/${productId}`);
        const result = await res.json();
        setData(result);
        setNewPrice(Number(result.originalPrice));
      } catch (err) {
        console.error(err);
        message.error("Lỗi khi tải dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, apiUrl]);

  if (!productId) return null;

  // Handle toggle display
  const handleToggleDisplay = async () => {
    if (!data) return;
    const { id, display } = data;

    setLoadingToggle(true);
    try {
      const res = await fetch(`${apiUrl}/products/display/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display: !display }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Lỗi khi cập nhật trạng thái");
      }

      message.success(`Đã ${!display ? "hiển thị" : "ẩn"} sản phẩm`);
      onRefetch();
      setData((prev: any) => ({ ...prev, display: !display }));
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi cập nhật trạng thái");
    } finally {
      setLoadingToggle(false);
    }
  };

  const handleUpdatePrice = async () => {
    if (!data) return;
    const { id } = data;

    try {
      await fetch(`${apiUrl}/products/price/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: newPrice }),
      });
      message.success("Cập nhật giá thành công");
      setEditPriceModalOpen(false);
      onRefetch();
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <Modal {...modalProps} title="Product Details" width={900} footer={null}>
      <Spin spinning={loading}>
        {data ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Popconfirm
                  title={`Xác nhận ${data.display ? "ẩn" : "hiện"} sản phẩm?`}
                  onConfirm={handleToggleDisplay}
                  okText="Xác nhận"
                  cancelText="Huỷ"
                >
                  <Button
                    size="small"
                    type={data.display ? "default" : "primary"}
                    icon={
                      data.display ? <EyeInvisibleOutlined /> : <EyeOutlined />
                    }
                    loading={loadingToggle}
                  >
                    {data.display ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}
                  </Button>
                </Popconfirm>

                <Button
                  size="small"
                  type="primary"
                  onClick={() => setEditPriceModalOpen(true)}
                >
                  Chỉnh sửa giá
                </Button>
              </Space>
            </div>

            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
              <Descriptions.Item label="Code">{data.code}</Descriptions.Item>
              <Descriptions.Item label="Name" span={2}>
                {data.name}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {data.category?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Brand">
                {data.brand?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Original Price">
                {Number(data.originalPrice).toLocaleString("vi-VN")} ₫
              </Descriptions.Item>
              <Descriptions.Item label="Sale Price">
                {data.salePrice
                  ? `${Number(data.salePrice).toLocaleString("vi-VN")} ₫`
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="View Count">
                {data.viewCount}
              </Descriptions.Item>
              <Descriptions.Item label="Sale Count">
                {data.saleCount}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(data.createdDate).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {new Date(data.updatedDate).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Description</Divider>
            <Typography.Paragraph>{data.metaDesc}</Typography.Paragraph>

            <Divider orientation="left">Photos</Divider>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {data.photos.map((photo: any) => (
                <Image key={photo.id} src={photo.url} width={150} />
              ))}
            </div>

            <Divider orientation="left">Variants</Divider>
            <Table
              dataSource={data.variants}
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
                  const size = data.sizes.find((s: any) => s.id === sizeId);
                  return size ? size.name : sizeId;
                }}
              />
              <Table.Column
                title="Color"
                dataIndex="colorId"
                render={(colorId) => {
                  const color = data.colors.find((c: any) => c.id === colorId);
                  return color ? color.name : colorId;
                }}
              />
              <Table.Column
                title="In Stock"
                dataIndex={["stockQuantity"]}
                render={(qty) =>
                  qty > 0 ? (
                    <Tag color="green">In Stock</Tag>
                  ) : (
                    <Tag color="red">Out</Tag>
                  )
                }
              />
              <Table.Column
                title="Stock Quantity"
                dataIndex={["stockQuantity"]}
              />
              <Table.Column
                title="Actions"
                render={(_, record) => (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => setAdjustVariantId(record.id)}
                  >
                    Adjust
                  </Button>
                )}
              />
            </Table>

            <AdjustStockModal
              open={!!AdjustVariantId}
              variantId={AdjustVariantId!}
              onClose={() => setAdjustVariantId(null)}
              onSuccess={onRefetch}
            />
          </>
        ) : (
          <Typography.Text>Đang tải dữ liệu sản phẩm...</Typography.Text>
        )}
      </Spin>

      {/* Modal chỉnh sửa giá */}
      <Modal
        open={editPriceModalOpen}
        title="Chỉnh sửa giá gốc"
        onCancel={() => setEditPriceModalOpen(false)}
        onOk={handleUpdatePrice}
        confirmLoading={loading}
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          value={newPrice}
          onChange={(val) => setNewPrice(val ?? 0)}
        />
      </Modal>
    </Modal>
  );
};
