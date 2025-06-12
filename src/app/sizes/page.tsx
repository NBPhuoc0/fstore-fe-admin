"use client";

import { useEffect, useState } from "react";
import { SizeCreateModal } from "@components/modal/size/create";
import { SizeEditModal } from "@components/modal/size/edit";
import { ISize } from "@interfaces";
import {
  DeleteButton,
  EditButton,
  List,
  useModalForm,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function SizeList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: createModalShow,
    formLoading: createFormLoading,
  } = useModalForm<ISize>({
    action: "create",
    syncWithLocation: true,
  });

  const {
    modalProps: editModalProps,
    formProps: editFormProps,
    show: editModalShow,
    formLoading: editFormLoading,
  } = useModalForm<ISize>({ action: "edit", syncWithLocation: true });

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
          <SizeCreateModal
            formProps={createFormProps}
            modalProps={createModalProps}
            loading={createFormLoading}
          />
          <SizeEditModal
            formProps={editFormProps}
            modalProps={editModalProps}
            loading={editFormLoading}
          />
        </>
      )}
    </>
  );
}
