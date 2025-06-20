"use client";

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Spin, Table, Typography } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useApiUrl } from "@refinedev/core";
import { Dayjs } from "dayjs";

const COLORS = [
  "#1890ff",
  "#13c2c2",
  "#faad14",
  "#f5222d",
  "#722ed1",
  "#52c41a",
];

export const RevenueByCategoryTab = ({ month }: { month: Dayjs }) => {
  const apiUrl = useApiUrl();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const y = month.year();
      const m = month.month() + 1;
      const res = await fetch(
        `${apiUrl}/dashboard/top-categories?y=${y}&m=${m}`
      );
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    fetchData();
  }, [month]);

  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: Number(item.totalRevenue),
  }));

  return (
    <Spin spinning={loading}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Typography.Title level={5}>
              Doanh thu theo danh mục
            </Typography.Title>
            <Row gutter={16}>
              <Col span={14}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={120}
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) =>
                        `${val.toLocaleString("vi-VN")} ₫`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Col>
              <Col span={10}>
                <div style={{ paddingTop: 12 }}>
                  {chartData.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          backgroundColor: COLORS[i % COLORS.length],
                          marginRight: 8,
                          borderRadius: 4,
                        }}
                      />
                      <Typography.Text>
                        {item.name}:{" "}
                        <strong>{item.value.toLocaleString("vi-VN")} ₫</strong>
                      </Typography.Text>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};
