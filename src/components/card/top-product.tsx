"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Spin, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { useApiUrl } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  month: Dayjs;
}

interface ProductData {
  productId: number;
  productName: string;
  totalSold: number;
}

export const TopSellingProductsTab = ({ month }: Props) => {
  const apiUrl = useApiUrl();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProductData[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/dashboard/top-selling-products?y=${month.year()}&m=${
          month.month() + 1
        }`
      );
      if (!res.ok) throw new Error("Failed to fetch top selling products");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  return (
    <Spin spinning={loading}>
      <Card style={{ marginBottom: 24 }}>
        <Typography.Title level={5}>
          Top sản phẩm bán chạy nhất
        </Typography.Title>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart layout="vertical" data={data}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="productName" width={250} />
            <Tooltip />
            <Bar dataKey="totalSold" fill="#1890ff" name={"đã bán"} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Spin>
  );
};
