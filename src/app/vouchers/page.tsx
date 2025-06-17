"use client";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { VoucherCreateModal } from "@components/modal/voucher/create";
import { VoucherShowModal } from "@components/modal/voucher/show";
import { IVoucher } from "@interfaces";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useModal,
  useModalForm,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Button, Space, Table } from "antd";
import { useEffect, useState } from "react";

export default function VoucherList() {
  const [isClient, setIsClient] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { tableProps } = useTable<IVoucher>({
    syncWithLocation: true,
  });

  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: createModalShow,
    formLoading: createFormLoading,
  } = useModalForm<IVoucher>({
    action: "create",
    syncWithLocation: true,
    autoSubmitClose: false,
  });

  return (
    <>
      <List
        headerButtons={({ defaultButtons }) => <>{defaultButtons}</>}
        createButtonProps={{ onClick: () => createModalShow() }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title={"Mã"} />
          <Table.Column dataIndex="name" title={"Tên voucher"} />
          <Table.Column
            dataIndex="status"
            title={"Trạng thái"}
            render={(status) => (status ? "Kích hoạt" : "Không kích hoạt")}
          />
          <Table.Column dataIndex="type" title={"Loại"} />
          <Table.Column dataIndex="description" title={"Mô tả"} />
          <Table.Column
            title={"Thao tác"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <ShowButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => setSelectedVoucherId(record.id as number)}
                />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>

      {isClient && (
        <>
          <VoucherCreateModal
            formProps={createFormProps}
            modalProps={createModalProps}
            loading={createFormLoading}
          />
          <VoucherShowModal
            modalProps={{
              open: !!selectedVoucherId,
              onCancel: () => setSelectedVoucherId(undefined),
            }}
            voucherId={selectedVoucherId}
          />
        </>
      )}
    </>
  );
}
