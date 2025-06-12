"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Typography,
  Tabs,
  DatePicker,
  Spin,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import moment from "moment";
import { useApiUrl } from "@refinedev/core";

const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;

const COLORS = [
  "#1890ff",
  "#13c2c2",
  "#faad14",
  "#f5222d",
  "#722ed1",
  "#52c41a",
];

export default function EcommerceDashboard() {
  const apiUrl = useApiUrl();
  const [loading, setLoading] = useState(false);

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);

  const [month, setMonth] = useState(moment());

  const fetchData = async () => {
    setLoading(true);
    try {
      const y = month.year();
      const m = month.month() + 1; // vì month() bắt đầu từ 0

      const [revenueRes, categoryRes, productRes] = await Promise.all([
        fetch(`${apiUrl}/dashboard/monthly-revenue?y=${y}&m=${m}`).then((res) =>
          res.json()
        ),
        fetch(`${apiUrl}/dashboard/top-categories?y=${y}&m=${m}`).then((res) =>
          res.json()
        ),
        fetch(`${apiUrl}/dashboard/top-selling-products?y=${y}&m=${m}`).then(
          (res) => res.json()
        ),
      ]);

      setRevenueData(revenueRes);
      setCategoryData(categoryRes);
      setProductData(productRes);
    } catch (err) {
      console.error("Fetch dashboard data failed", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  const totalRevenue = revenueData.reduce(
    (acc, item) => acc + item.totalRevenue,
    0
  );
  const totalDays = revenueData.length;

  const revenueChartData = revenueData.map((item) => ({
    date: moment(item.date).format("DD/MM"),
    totalRevenue: item.totalRevenue,
  }));

  const categoryChartData = categoryData.map((item) => ({
    name: item.categoryName,
    value: Number(item.totalRevenue),
  }));

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>Ecommerce Dashboard</Typography.Title>

      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Typography.Title level={5}>Statistics by month:</Typography.Title>
        <MonthPicker
          value={month}
          onChange={(val) => val && setMonth(val)}
          format="MM/YYYY"
          allowClear={false}
        />
      </Row>

      <Spin spinning={loading}>
        <Tabs defaultActiveKey="daily">
          {/* Tab 1: Revenue by Date */}
          <TabPane tab="Revenue by month" key="daily">
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Total Revenue"
                    value={totalRevenue}
                    valueStyle={{ color: "#3f8600" }}
                    formatter={(value: any) =>
                      `${value.toLocaleString("vi-VN")} ₫`
                    }
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Total Days"
                    value={totalDays}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
            </Row>

            <Card style={{ marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueChartData}>
                  <XAxis dataKey="date" />
                  <YAxis
                    tickFormatter={(val) => `${(val / 1e6).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(value: any) =>
                      `${value.toLocaleString("vi-VN")} ₫`
                    }
                  />
                  <Bar dataKey="totalRevenue" fill="#1890ff" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Table
              dataSource={revenueData}
              rowKey={(record) => record.date}
              bordered
              pagination={false}
            >
              <Table.Column
                title="Date"
                dataIndex="date"
                render={(value) => moment(value).format("DD/MM/YYYY")}
              />
              <Table.Column
                title="Total Revenue"
                dataIndex="totalRevenue"
                align="right"
                render={(value: number) =>
                  value.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                }
              />
            </Table>
          </TabPane>

          {/* Tab 2: Revenue by Category */}
          <TabPane tab="Revenue by Category" key="category">
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card>
                  <Typography.Title level={5}>
                    Revenue by Category
                  </Typography.Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                      >
                        {categoryChartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) =>
                          `${value.toLocaleString("vi-VN")} ₫`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Legend với màu */}
                  <div style={{ marginTop: 16 }}>
                    {categoryChartData.map((item, index) => (
                      <div
                        key={index}
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
                            backgroundColor: COLORS[index % COLORS.length],
                            marginRight: 8,
                            borderRadius: 4,
                          }}
                        />
                        <Typography.Text>
                          {item.name}:{" "}
                          <strong>
                            {item.value.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </strong>
                        </Typography.Text>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>

            <Table
              dataSource={categoryData}
              rowKey={(record) => record.categoryId}
              bordered
              pagination={false}
            >
              <Table.Column title="Category" dataIndex="categoryName" />
              <Table.Column
                title="Quantity Sold"
                dataIndex="totalQuantitySold"
                align="center"
              />
              <Table.Column
                title="Total Revenue"
                dataIndex="totalRevenue"
                align="right"
                render={(value: string) =>
                  Number(value).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                }
              />
            </Table>
          </TabPane>

          {/* Tab 3: Top Selling Products */}
          <TabPane tab="Top Selling Products" key="top-products">
            <Card style={{ marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={productData}>
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="productName" width={250} />
                  <Tooltip />
                  <Bar dataKey="totalSold" fill="#1890ff" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Table
              dataSource={productData}
              rowKey={(record) => record.productId}
              bordered
              pagination={false}
            >
              <Table.Column title="Product Name" dataIndex="productName" />
              <Table.Column
                title="Quantity Sold"
                dataIndex="totalSold"
                align="center"
              />
            </Table>
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
}
