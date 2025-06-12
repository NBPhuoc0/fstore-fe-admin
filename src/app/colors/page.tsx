"use client";

import { ColorCreateModal } from "@components/modal/color/create";
import { ColorEditModal } from "@components/modal/color/edit";
import { IColor } from "@interfaces";
import {
  DeleteButton,
  EditButton,
  List,
  useModalForm,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import { useEffect, useState } from "react";

export default function ColorList() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { tableProps } = useTable<IColor>({
    syncWithLocation: true,
  });

  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: createModalShow,
    formLoading: createFormLoading,
  } = useModalForm<IColor>({
    action: "create",
    syncWithLocation: true,
    autoSubmitClose: false,
  });

  const {
    modalProps: editModalProps,
    formProps: editFormProps,
    show: editModalShow,
    formLoading: editFormLoading,
  } = useModalForm<IColor>({ action: "edit", syncWithLocation: true });

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
          <ColorCreateModal
            formProps={createFormProps}
            modalProps={createModalProps}
            loading={createFormLoading}
          />
          <ColorEditModal
            formProps={editFormProps}
            modalProps={editModalProps}
            loading={editFormLoading}
          />
        </>
      )}
    </>
  );
}
