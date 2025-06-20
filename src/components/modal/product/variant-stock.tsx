"use client";

import React, { useEffect, useState } from "react";
import { Modal, ModalProps, Table, Tag, Spin, Typography } from "antd";
import { useApiUrl } from "@refinedev/core";

interface Props extends ModalProps {
  variantId: number | null;
  onClose: () => void;
}

interface StockItem {
  id: number;
  import_batch_id: number;
  quantity: number;
  remain_quantity: number;
  price: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export const VariantStockModal: React.FC<Props> = ({
  open,
  onClose,
  variantId,
}) => {
  const apiUrl = useApiUrl();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StockItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!variantId || !open) return;
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/inventory/stock/${variantId}`);
        const json = await res.json();
        setData(json || []);
      } catch (err) {
        console.error("Failed to fetch stock", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [variantId, open]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title={`Chi tiết tồn kho - Variant ID: ${variantId}`}
      width={800}
    >
      <Spin spinning={loading}>
        <Typography.Text type="secondary">
          Tổng số lần nhập: {data.length}
        </Typography.Text>

        <Table
          dataSource={data}
          rowKey="id"
          pagination={false}
          bordered
          style={{ marginTop: 16 }}
        >
          <Table.Column title="Batch ID" dataIndex="import_batch_id" />
          <Table.Column
            title="Số lượng nhập"
            dataIndex="quantity"
            align="center"
          />
          <Table.Column
            title="Còn lại"
            dataIndex="remain_quantity"
            align="center"
            render={(val) => (
              <Tag color={val === 0 ? "red" : "green"}>{val}</Tag>
            )}
          />
          <Table.Column
            title="Giá nhập"
            dataIndex="price"
            align="right"
            render={(val: string) => `${Number(val).toLocaleString("vi-VN")} ₫`}
          />
          <Table.Column
            title="Ghi chú"
            dataIndex="note"
            render={(val) => val || "-"}
          />
          <Table.Column
            title="Ngày nhập"
            dataIndex="created_at"
            render={(val: string) => new Date(val).toLocaleString("vi-VN")}
          />
        </Table>
      </Spin>
    </Modal>
  );
};
