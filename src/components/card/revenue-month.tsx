"use client";

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Spin, Statistic, Table } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApiUrl } from "@refinedev/core";
import { Dayjs } from "dayjs";
import moment from "moment";

interface Props {
  month: Dayjs;
}

export const RevenueByMonthTab: React.FC<Props> = ({ month }) => {
  const apiUrl = useApiUrl();
  const [dataRevenue, setDataRevenue] = useState<any[]>([]);
  const [dataCount, setDataCount] = useState<{ success: number; fail: number }>(
    {
      success: 0,
      fail: 0,
    }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      const y = month.year();
      const m = month.month() + 1;
      const [monthRes, countRes] = await Promise.all([
        fetch(`${apiUrl}/dashboard/monthly-revenue?y=${y}&m=${m}`).then(
          (res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch monthly revenue");
            }
            return res.json();
          }
        ),
        fetch(`${apiUrl}/dashboard/count-orders?y=${y}&m=${m}`).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch monthly revenue");
          }
          return res.json();
        }),
      ]);
      setDataRevenue(monthRes);
      setDataCount(countRes);
      setLoading(false);
    };
    fetchRevenue();
  }, [month]);

  const totalDays = month.daysInMonth();

  // Tạo danh sách đủ ngày trong tháng
  const fullDays = Array.from({ length: totalDays }, (_, i) => {
    const date = moment(month.format("YYYY-MM-DD"))
      .date(i + 1)
      .format("YYYY-MM-DD");
    const record = dataRevenue.find(
      (d) => moment(d.date).format("YYYY-MM-DD") === date
    );
    return {
      date: moment(date).format("DD/MM"),
      fullDate: date,
      totalRevenue: record?.totalRevenue || 0,
    };
  });

  const totalRevenue = fullDays.reduce((acc, cur) => acc + cur.totalRevenue, 0);

  return (
    <Spin spinning={loading}>
      <Row gutter={16} style={{ marginBottom: 24 }} align="stretch">
        <Col span={8}>
          <Card style={{ height: "100%" }}>
            <Statistic
              title="Tổng doanh thu trong tháng"
              value={totalRevenue}
              valueStyle={{ color: "#3f8600" }}
              formatter={(val: any) => `${val.toLocaleString("vi-VN")} ₫`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Đơn hàng" style={{ height: "100%" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Thành công"
                  value={dataCount.success}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Thất bại"
                  value={dataCount.fail}
                  valueStyle={{ color: "#f5222d" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Card style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fullDays}>
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(val) => `${(val / 1e6).toFixed(1)}M`} />
            <Tooltip
              formatter={(val: any) => `${val.toLocaleString("vi-VN")} ₫`}
            />
            <Bar
              dataKey="totalRevenue"
              name={"Tổng doanh thu trong ngày"}
              fill="#1890ff"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Spin>
  );
};
