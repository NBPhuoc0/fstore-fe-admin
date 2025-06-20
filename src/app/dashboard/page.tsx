"use client";

import { Typography, Tabs, DatePicker } from "antd";
import { useState } from "react";

import dayjs, { Dayjs } from "dayjs";
import { RevenueByMonthTab } from "@components/card/revenue-month";
import { RevenueByCategoryTab } from "@components/card/revenue-cate";
import { TopSellingProductsTab } from "@components/card/top-product";

const { TabPane } = Tabs;
const { MonthPicker } = DatePicker;

export default function EcommerceDashboard() {
  const [month, setMonth] = useState<Dayjs>(dayjs());

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>Ecommerce Dashboard</Typography.Title>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Typography.Title level={5}>Statistics by month:</Typography.Title>
        <MonthPicker
          value={month}
          onChange={(val) => val && setMonth(val)}
          format="MM/YYYY"
          allowClear={false}
        />
      </div>

      <div style={{ marginBottom: 32 }}>
        <RevenueByMonthTab month={month} />
      </div>

      <div style={{ marginBottom: 32 }}>
        <RevenueByCategoryTab month={month} />
      </div>

      <div>
        <TopSellingProductsTab month={month} />
      </div>
    </div>
  );
}
