"use client";

import { BrandCreateModal } from "@components/modal/brand/create";
import { BrandEditModal } from "@components/modal/brand/edit";
import { IBrand } from "@interfaces";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useModalForm,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import { useEffect, useState } from "react";

export default function BrandList() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { tableProps } = useTable<IBrand>({
    syncWithLocation: true,
  });

  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: createModalShow,
    formLoading: createFormLoading,
  } = useModalForm<IBrand>({
    action: "create",
    syncWithLocation: true,
    autoSubmitClose: false,
  });

  const {
    modalProps: editModalProps,
    formProps: editFormProps,
    show: editModalShow,
    formLoading: editFormLoading,
  } = useModalForm<IBrand>({ action: "edit", syncWithLocation: true });

  return (
    <>
      <List createButtonProps={{ onClick: () => createModalShow() }}>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title={"ID"} />
          <Table.Column dataIndex="name" title={"Name"} />
          <Table.Column
            title={"Actions"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <EditButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => editModalShow(record.id)}
                />
                {/* <ShowButton hideText size="small" recordItemId={record.id} /> */}
                {/* <DeleteButton hideText size="small" recordItemId={record.id} /> */}
              </Space>
            )}
          />
        </Table>
      </List>
      {isClient && (
        <>
          <BrandCreateModal
            formProps={createFormProps}
            modalProps={createModalProps}
            loading={createFormLoading}
          />
          <BrandEditModal
            formProps={editFormProps}
            modalProps={editModalProps}
            loading={editFormLoading}
          />
        </>
      )}
    </>
  );
}
