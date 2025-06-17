"use client";

import { BankOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import { OrderDashboardSummary } from "@components/card/order-summary";
import { formatVND } from "@components/helper";
import { OrderDetailModal } from "@components/modal/order/show";
import { IOrder } from "@interfaces";
import { List, RefreshButton, ShowButton, useModal } from "@refinedev/antd";
import { BaseRecord, useApiUrl, useCustom } from "@refinedev/core";
import { Select, Space, Table, Tag, DatePicker, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export default function OrdersPage() {
  const apiUrl = useApiUrl();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [orderData, setOrderData] = useState<IOrder | null>(null);
  const { show, close, modalProps } = useModal();

  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useCustom<IOrder[]>({
    url: `${apiUrl}/orders`,
    method: "get",
    config: {
      query: {
        y: selectedDate.year().toString(),
        m: (selectedDate.month() + 1).toString(),
      },
    },
  });

  const {
    data: summaryData,
    isLoading: loadingSummary,
    refetch: refetchSummary,
  } = useCustom<any>({
    url: `${apiUrl}/orders/dashboard`,
    method: "get",
    config: {
      query: {
        y: selectedDate.year().toString(),
        m: (selectedDate.month() + 1).toString(),
      },
    },
  });

  const showOrder = (data: IOrder) => {
    setOrderData(data);
    show();
  };
  const handleGlobalRefetch = () => {
    refetch();
    refetchSummary();
  };
  const filteredData = useMemo(() => {
    if (!selectedStatus) return ordersData?.data || [];
    return (ordersData?.data || []).filter(
      (item) => item.status === selectedStatus
    );
  }, [ordersData?.data, selectedStatus]);

  const orderStatusOptions = [
    { label: "Chờ thanh toán", value: "PENDING" },
    { label: "Đang xử lý", value: "PROCESSING" },
    { label: "Đang giao hàng", value: "DELIVERING" },
    { label: "Hoàn thành", value: "COMPLETED" },
    { label: "Đã hủy", value: "CANCELLED" },
    { label: "Đang xử lý trả hàng", value: "RETURN_PROCESSING" },
    { label: "Đã trả hàng", value: "RETURNED" },
    { label: "Đã đổi hàng", value: "EXCHANGED" },
    { label: "Chờ hoàn tiền", value: "WAITING_REFUND" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "orange";
      case "PROCESSING":
        return "geekblue";
      case "DELIVERING":
        return "blue";
      case "COMPLETED":
        return "green";
      case "CANCELLED":
        return "red";
      case "RETURN_PROCESSING":
        return "purple";
      case "RETURNED":
        return "magenta";
      case "EXCHANGED":
        return "cyan";
      case "WAITING_REFUND":
        return "gold";
      default:
        return "default";
    }
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker
          picker="month"
          value={selectedDate}
          onChange={(date) => {
            if (date) {
              setSelectedDate(date);
              handleGlobalRefetch();
            }
          }}
        />
      </Space>

      <OrderDashboardSummary
        summaryData={summaryData}
        isLoading={loadingSummary}
      />
      <div style={{ marginBottom: 24 }} />

      <List
        headerButtons={({ defaultButtons }) => (
          <Space wrap>
            {defaultButtons}
            <RefreshButton resource="orders" onClick={handleGlobalRefetch} />
            <Select
              allowClear
              placeholder="Lọc theo trạng thái"
              style={{ width: 220 }}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value || undefined)}
              options={orderStatusOptions}
            />
          </Space>
        )}
      >
        <Spin spinning={isLoading}>
          <Table rowKey="id" dataSource={filteredData}>
            <Table.Column dataIndex="id" title={"Mã"} />
            <Table.Column dataIndex="name" title={"Tên khách hàng"} />
            <Table.Column dataIndex="email" title={"Email"} />
            <Table.Column dataIndex="phone" title={"Số điện thoại"} />
            <Table.Column
              dataIndex="paymentMethod"
              title={"Thanh toán"}
              render={(val) => {
                const color = val === "COD" ? "DarkSeaGreen" : "DodgerBlue";
                const icon =
                  val === "COD" ? <MoneyCollectOutlined /> : <BankOutlined />;
                return (
                  <span style={{ color }}>
                    {icon} - {val === "COD" ? "Tiền mặt" : "Chuyển khoản"}
                  </span>
                );
              }}
            />
            <Table.Column
              dataIndex="total"
              title={"Tổng tiền"}
              render={(val) => formatVND(val)}
            />
            <Table.Column
              title="Trạng thái"
              dataIndex="status"
              render={(value: string) => {
                const statusLabel =
                  orderStatusOptions.find((opt) => opt.value === value)
                    ?.label || value;
                return <Tag color={getStatusColor(value)}>{statusLabel}</Tag>;
              }}
            />
            <Table.Column
              title={"Thao tác"}
              render={(_, record: BaseRecord) => (
                <Space>
                  <ShowButton
                    hideText
                    size="small"
                    onClick={() => showOrder(record as IOrder)}
                  />
                </Space>
              )}
            />
          </Table>
        </Spin>
      </List>

      <OrderDetailModal
        modalProps={modalProps}
        data={orderData}
        onRefetch={() => {
          close();
          handleGlobalRefetch();
        }}
      />
    </>
  );
}
