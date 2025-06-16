"use client";
import {
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MoneyCollectOutlined,
  WarningOutlined,
  RetweetOutlined,
  ReloadOutlined,
  FileSearchOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { OrderShowModal } from "@components/modal/order/show";
import { IOrder } from "@interfaces";
import {
  useTable,
  List,
  RefreshButton,
  ShowButton,
  useModal,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Select, Space, Table } from "antd";
import { useEffect, useMemo, useState } from "react";

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  const { tableProps, tableQuery } = useTable<IOrder>({
    syncWithLocation: true,
  });
  const { show, close, modalProps } = useModal();
  const [orderData, setOrderData] = useState<IOrder | null>(null);

  const showOrder = (data: IOrder) => {
    setOrderData(data);
    show();
  };

  const filteredData = useMemo(() => {
    if (!selectedStatus) return tableProps?.dataSource || [];
    return (tableProps?.dataSource || []).filter(
      (item) => item.status === selectedStatus
    );
  }, [tableProps.dataSource, selectedStatus]);

  const orderStatusOptions = [
    { label: "PENDING", value: "PENDING" },
    { label: "PROCESSING", value: "PROCESSING" },
    { label: "DELIVERED", value: "DELIVERED" },
    { label: "COMPLETED", value: "COMPLETED" },
    { label: "CANCELLED", value: "CANCELLED" },
    { label: "RETURNED", value: "RETURNED" },
    { label: "REFUNDED", value: "REFUNDED" },
    { label: "WAITTING_REFUND", value: "WAITTING_REFUND" },
  ];

  return (
    <>
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
            <RefreshButton
              resource="orders"
              onClick={() => tableQuery.refetch()}
            />
            <Select
              allowClear
              placeholder="Filter by status"
              style={{ width: 220 }}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value || undefined)}
              options={orderStatusOptions}
            />
          </>
        )}
      >
        <Table {...tableProps} rowKey="id" dataSource={filteredData}>
          <Table.Column dataIndex="id" title={"ID"} />
          <Table.Column dataIndex="name" title={"Customer name"} />
          <Table.Column dataIndex="email" title={"Email"} />
          <Table.Column dataIndex="phone" title={"Phone"} />
          <Table.Column
            dataIndex="paymentMethod"
            title={"Payment"}
            render={(val) => {
              const color = val === "COD" ? "DarkSeaGreen" : "DodgerBlue";
              const icon =
                val === "COD" ? <MoneyCollectOutlined /> : <BankOutlined />;
              return (
                <span style={{ color }}>
                  {icon} - {val}
                </span>
              );
            }}
          />
          <Table.Column dataIndex="total" title={"Total"} />
          <Table.Column
            dataIndex="status"
            title={"Status"}
            render={(value) => {
              const statusMap: any = {
                PENDING: { icon: <WarningOutlined />, color: "red" },
                PROCESSING: { icon: <ClockCircleOutlined />, color: "orange" },
                DELIVERED: { icon: <CheckCircleOutlined />, color: "green" },
                COMPLETED: { icon: <ReloadOutlined />, color: "green" },
                CANCELLED: { icon: <WarningOutlined />, color: "gray" },
                RETURNED: { icon: <RetweetOutlined />, color: "purple" },
                REFUNDED: { icon: <DollarOutlined />, color: "blue" },
                WAITTING_REFUND: {
                  icon: <FileSearchOutlined />,
                  color: "orangered",
                },
              };
              const { icon, color } = statusMap[value] || {};
              return (
                <span style={{ color }}>
                  {icon} - {value}
                </span>
              );
            }}
          />
          <Table.Column
            title={"Actions"}
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
      </List>

      {isClient && (
        <OrderShowModal
          modalProps={modalProps}
          data={orderData}
          refetch={() => tableQuery.refetch()}
        />
      )}
    </>
  );
}
