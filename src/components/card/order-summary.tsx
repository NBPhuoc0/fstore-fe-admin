"use client";

import { Card, Col, Row, Statistic, Spin, Button } from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Dayjs } from "dayjs";

interface OrderDashboardSummaryProps {
  summaryData?: any;
  isLoading: boolean;
  onRefresh?: () => void;
}

export const OrderDashboardSummary = ({
  summaryData,
  isLoading,
}: OrderDashboardSummaryProps) => {
  const summary = summaryData?.data || { fail: 0, completed: 0, processing: 0 };

  return (
    <Spin spinning={isLoading}>
      <Card title="Tổng quan đơn hàng">
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Đang xử lý"
              value={summary.processing}
              prefix={<SyncOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Hoàn thành"
              value={summary.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Huỷ / lỗi"
              value={summary.fail}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Col>
        </Row>
      </Card>
    </Spin>
  );
};
