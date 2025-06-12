"use client";
import {
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MoneyCollectOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { OrderShowModal } from "@components/modal/order/show";
import { IOrder } from "@interfaces";
import {
  DeleteButton,
  EditButton,
  ShowButton,
  useTable,
  List,
  RefreshButton,
  ImageField,
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
  useEffect(() => {
    setIsClient(true);
  }, []);
  const { tableProps, tableQuery } = useTable<IOrder>({
    syncWithLocation: true,
  });
  const { show, close, modalProps } = useModal();
  const [productData, setProductData] = useState<IOrder | null>(null);
  const showProduct = (data: IOrder) => {
    setProductData(data);
    show();
  };
  const filteredData = useMemo(() => {
    if (!selectedStatus) return tableProps?.dataSource || [];
    return (tableProps?.dataSource || []).filter(
      (item) => item.status === selectedStatus
    );
  }, [tableProps.dataSource, selectedStatus]);
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
              style={{ width: 200 }}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value || undefined)}
              options={[
                { label: "PENDING", value: "PENDING" },
                { label: "PROCESSING", value: "PROCESSING" },
                { label: "DELIVERED", value: "DELIVERED" },
                { label: "CANCELED", value: "CANCELLED" },

                { label: "ALL", value: undefined },
              ]}
            />
          </>
        )}
      >
        <Table {...tableProps} rowKey="id" dataSource={filteredData}>
          <Table.Column dataIndex="id" title={"ID"} />
          <Table.Column dataIndex="name" title={"Customer name"} />
          <Table.Column dataIndex="email" title={"Customer email"} />
          <Table.Column dataIndex="phone" title={"Customer phone"} />
          <Table.Column
            dataIndex="paymentMethod"
            title={"Payment method"}
            render={(val) => {
              let icon;
              let color = "DodgerBlue";
              if (val === "COD") {
                icon = <MoneyCollectOutlined />;
                color = "DarkSeaGreen";
              } else icon = <BankOutlined />;

              return (
                <span style={{ color: color }}>
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
              let icon;
              if (value === "CANCELLED") {
                icon = (
                  <span style={{ color: "red" }}>
                    <WarningOutlined /> - Canceled
                  </span>
                );
              } else if (value === "PENDING") {
                icon = (
                  <span style={{ color: "red" }}>
                    <WarningOutlined /> - Pending
                  </span>
                );
              } else if (value === "DELIVERED") {
                icon = (
                  <span style={{ color: "green" }}>
                    <CheckCircleOutlined /> - Delivered
                  </span>
                );
              } else if (value === "PROCESSING") {
                icon = (
                  <span style={{ color: "orange" }}>
                    <ClockCircleOutlined /> - Processing
                  </span>
                );
              } else {
                icon = <span>{value}</span>;
              }
              return icon;
            }}
          />
          <Table.Column
            title={"Actions"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                {/* <EditButton hideText size="small" recordItemId={record.id} /> */}

                <ShowButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={showProduct.bind(null, record as IOrder)}
                />
                {/* <DeleteButton hideText size="small" recordItemId={record.id} /> */}
              </Space>
            )}
          />
        </Table>
      </List>
      {isClient && (
        <>
          <OrderShowModal
            modalProps={modalProps}
            data={productData}
            refetch={() => tableQuery.refetch()}
          />{" "}
        </>
      )}
    </>
  );
}
