import {
  Modal,
  ModalProps,
  Descriptions,
  Statistic,
  Row,
  Col,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useApiUrl } from "@refinedev/core";

interface ImportBatchShowModalProps {
  open: boolean;
  onClose: () => void;
  batchId: number | null;
}

export const ImportBatchShowModal: React.FC<ImportBatchShowModalProps> = ({
  open,
  onClose,
  batchId,
}) => {
  const apiUrl = useApiUrl();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (open && batchId) {
      setLoading(true);
      fetch(`${apiUrl}/inventory/import-batch/${batchId}`)
        .then((res) => res.json())
        .then((result) => {
          setData(result);
        })
        .catch((err) => console.error("Error fetching batch data:", err))
        .finally(() => setLoading(false));
    }
  }, [open, batchId]);

  const batch = data?.batch || {};
  const realRevenue = data?.realRevenue || 0;
  const expectedRevenue = data?.expectedRevenue || 0;

  const totalImported = data?.totalImported || 0;
  const totalRemaining = data?.totalRemaining || 0;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title={`Lô hàng #${batchId}`}
      width={700}
    >
      <Spin spinning={loading}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="ID">{batch.id}</Descriptions.Item>
          <Descriptions.Item label="Nhà cung cấp">
            {batch.supplierName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú" span={2}>
            {batch.note || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Chi phí phát sinh">
            {batch.incidentalCosts != null
              ? `${batch.incidentalCosts.toLocaleString("vi-VN")} ₫`
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo">
            {batch.createdBy || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {batch.createdAt ? new Date(batch.createdAt).toLocaleString() : "-"}
          </Descriptions.Item>
        </Descriptions>

        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={8}>
            <Statistic
              title="Tổng chi phí"
              value={batch.totalCost || 0}
              suffix="₫"
              valueStyle={{ color: "#fa8c16" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Thực thu"
              value={realRevenue}
              suffix="₫"
              valueStyle={{ color: "#3f8600" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Doanh thu chưa ghi nhận"
              value={expectedRevenue}
              suffix="₫"
              valueStyle={{ color: "#cf1322" }}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Statistic
              title="Tổng số lượng đã nhập"
              value={totalImported}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Số lượng còn tồn"
              value={totalRemaining}
              valueStyle={{ color: "#722ed1" }}
            />
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};
