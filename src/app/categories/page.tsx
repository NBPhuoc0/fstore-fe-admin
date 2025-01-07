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

export default function CategoryList() {
  const { tableProps } = useTable<ICategory>({
    syncWithLocation: true,
  });

  // const { data: categoryData, isLoading: categoryIsLoading } = useMany({
  //   resource: "categories",
  //   ids:
  //     tableProps?.dataSource?.map((item) => item?.parent?.id).filter(Boolean) ??
  //     [],
  //   queryOptions: {
  //     enabled: !!tableProps?.dataSource,
  //   },
  // });
  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "id",
  });

  const {
    modalProps: createModalProps,
    formProps: createFormProps,
    show: createModalShow,
  } = useModalForm<ICategory>({
    action: "create",
  });

  return (
    <>
      <List createButtonProps={{ onClick: () => createModalShow() }}>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title={"ID"} />
          <Table.Column dataIndex="name" title={"Name"} />
          <Table.Column dataIndex="urlHandle" title={"URL Handle"} />
          <Table.Column
            dataIndex={"parent"}
            title={"Parent"}
            render={
              (value) => value?.name
              // categoryIsLoading ? (
              //   <>Loading...</>
              // ) : (
              //   categoryData?.data?.find((item) => item.id === value?.id)?.name
              // )
            }
          />
          <Table.Column
            title={"Actions"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>
      <Modal {...createModalProps} title="Create Category">
        <Form {...createFormProps} layout="vertical">
          <Form.Item
            label={"Name"}
            name={["name"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={"Parent"} name={["parent"]}>
            <Select {...categorySelectProps} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
