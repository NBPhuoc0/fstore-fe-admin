"use client";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { AddProductToPromotionModal } from "@components/modal/promotion/add-prod";
import { PromotionCreateModal } from "@components/modal/promotion/create";
import { IPromotion } from "@interfaces";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useModalForm,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Button, Space, Table } from "antd";
import { useEffect, useState } from "react";

export default function PromotionList() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { tableProps } = useTable<IPromotion>({
    syncWithLocation: true,
  });

  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: createModalShow,
    formLoading: createFormLoading,
  } = useModalForm<IPromotion>({
    action: "create",
    syncWithLocation: true,
    autoSubmitClose: false,
  });

  const {
    close,
    modalProps: editModalProps,
    formProps: editFormProps,
    show: editModalShow,
    formLoading: editFormLoading,
  } = useModalForm<IPromotion>({
    action: "edit",
    syncWithLocation: true,
    autoSubmitClose: false,
    warnWhenUnsavedChanges: false,
  });

  editFormProps.onFinish = (values) => {
    close(); // Close the modal after submission
    console.log("Edit Promotion Form Submitted", values);
    // You can add additional logic here, such as updating the promotion list
  };

  const addProductButton = (
    <Button
      icon={<PlusOutlined />}
      onClick={() => {
        console.log("Add Product to Promotion button clicked");
        editModalShow();
      }}
      type="primary"
      style={{ marginLeft: 8 }}
    >
      Add Product to Promotion
    </Button>
  );
  return (
    <>
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
            {addProductButton}
          </>
        )}
        createButtonProps={{ onClick: () => createModalShow() }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title={"ID"} />
          <Table.Column dataIndex="name" title={"Name"} />
          <Table.Column dataIndex="urlHandle" title={"URL Handle"} />
          <Table.Column
            dataIndex="status"
            title={"Status"}
            render={(status) => (status ? "Active" : "Inactive")}
          />
          <Table.Column dataIndex="type" title={"Type"} />
          <Table.Column dataIndex="description" title={"Description"} />
          <Table.Column
            title={"Actions"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                {/* <Button icon={<CheckOutlined />} size="small" /> */}
                {/* <Button icon={<CloseOutlined />} size="small" /> */}
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
          <PromotionCreateModal
            formProps={createFormProps}
            modalProps={createModalProps}
            loading={createFormLoading}
          />
          <AddProductToPromotionModal
            formProps={editFormProps}
            loading={editFormLoading}
            modalProps={editModalProps}
          />
        </>
      )}
    </>
  );
}
