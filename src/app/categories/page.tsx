"use client";

import { ICategory } from "@interfaces";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useModalForm,
  useSelect,
  useTable,
} from "@refinedev/antd";
import { useMany, type BaseRecord } from "@refinedev/core";
import { Form, Input, Modal, Select, Space, Table } from "antd";
import { CategoryCreateModal } from "../../components/modal/category/create";
import { CategoryEditModal } from "@components/modal/category/edit";
import { useEffect, useState } from "react";

export default function CategoryList() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { tableProps } = useTable<ICategory>({
    syncWithLocation: true,
  });

  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: createModalShow,
    formLoading: createFormLoading,
  } = useModalForm<ICategory>({
    action: "create",
    syncWithLocation: true,
    autoSubmitClose: false,
  });

  const {
    modalProps: editModalProps,
    formProps: editFormProps,
    show: editModalShow,
    formLoading: editFormLoading,
  } = useModalForm<ICategory>({ action: "edit", syncWithLocation: true });

  return (
    <>
      <List createButtonProps={{ onClick: () => createModalShow() }}>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title={"Mã"} />
          <Table.Column dataIndex="name" title={"Tên danh mục"} />
          <Table.Column dataIndex="urlHandle" title={"Đường dẫn URL"} />
          <Table.Column
            dataIndex={"parent"}
            title={"Danh mục cha"}
            render={(value) => (value ? `${value.id} - ${value.name}` : "")}
          />
          <Table.Column
            title={"Thao tác"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <EditButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => editModalShow(record.id)}
                />
                {/* <DeleteButton hideText size="small" recordItemId={record.id} /> */}
              </Space>
            )}
          />
        </Table>
      </List>
      {isClient && (
        <>
          <CategoryCreateModal
            formProps={createFormProps}
            loading={createFormLoading}
            modalProps={createModalProps}
          />
          <CategoryEditModal
            formProps={editFormProps}
            loading={editFormLoading}
            modalProps={editModalProps}
          />
        </>
      )}
    </>
  );
}
