"use client";

import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { IColor, IProduct, ISize } from "@interfaces";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Button, Form, Input, Select, Upload, Image } from "antd";
import { useState } from "react";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useApiUrl, useCustom, useNotification } from "@refinedev/core";

interface SelectedProps {
  value: string;
  label: string;
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
interface PostUniqueCheckResponse {
  isAvailable: boolean;
}
export default function ProductCreate() {
  const { formProps, saveButtonProps, onFinish } = useForm<IProduct>({
    redirect: "create",

    onMutationError(error, variables, context, isAutoSave) {
      console.error("error \n");
      console.error(error);
    },
    // start upload img if create product success
    onMutationSuccess(data, variables, context, isAutoSave) {
      console.log("success !!!!!!\n");
      ///code here!!
      uploadImages(data.data.id);
    },
  });
  const apiUrl = useApiUrl();
  const { open, close } = useNotification();

  const [selectedColors, setSelectedColors] = useState<SelectedProps[]>([]);
  const [fileLists, setFileLists] = useState<Record<string, UploadFile[]>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange =
    (colorId: string): UploadProps["onChange"] =>
    ({ fileList: newFileList }) => {
      setFileLists((prev) => ({
        ...prev,
        [colorId]: newFileList,
      }));
    };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const uploadImages = async (productId: string) => {
    for (const color of selectedColors) {
      const images = fileLists[color.value];

      if (!images || images.length === 0) continue; // Skip nếu không có ảnh

      const formData = new FormData();
      images.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj);
        }
      });

      try {
        const response = await fetch(
          `${apiUrl}/products/${productId}/variant/${color.value}`,
          {
            method: "PATCH",
            body: formData,
          }
        );
        const result = await response.json();
        open?.({
          key: productId,
          message: "Upload images success",
          description: `Uploaded images for color ${color.label}`,
          type: "success",
          undoableTimeout: 2000,
        });
        console.log(`Uploaded images for color ${color.label}:`, result);
      } catch (error) {
        open?.({
          key: productId,
          message: "Upload images failed",
          description: `Failed to upload images for color ${color.label}: ${error}`,
          type: "error",
          undoableTimeout: 2000,
        });
        console.error(
          `Failed to upload images for color ${color.label}:`,
          error
        );
      }
    }
  };

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
  });

  const { selectProps: brandSelectProps } = useSelect({
    resource: "brands",
    optionLabel: "name",
  });

  const { selectProps: sizeSelectProps } = useSelect<ISize>({
    resource: "sizes",
    optionLabel: "name",
  });

  const { selectProps: colorSelectProps } = useSelect<IColor>({
    resource: "colors",
    optionLabel: "name",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue="Quần Kaki Nam Slimfit"
        >
          <Input />
        </Form.Item>
        <Form.Item label="Promotion" name="promotion">
          <Input />
        </Form.Item>
        <Form.Item
          label="Meta Description"
          name="metaDesc"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={
            "Kiểu dáng Slim fit ôm sát tôn lên đường nét cơ thể, giúp bạn tự tin và khoẻ khoắn trong mọi hoạt động từ đi làm, đi chơi đến dự tiệc. Sản phẩm hoàn hảo cho phái mạnh hiện đại - tự tin khẳng định phong cách."
          }
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Original Price"
          name="originalPrice"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={450000}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Category"
          name={["categoryId"]}
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={10}
        >
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item
          label="Brand"
          name="brandId"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={1}
        >
          <Select {...brandSelectProps} />
        </Form.Item>
        <Form.Item
          label="Sizes"
          name="sizeIds"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={[1, 2, 3, 4]}
        >
          <Select {...sizeSelectProps} mode="multiple" />
        </Form.Item>
        <Form.Item
          label="Colors"
          name="colorIds"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            {...colorSelectProps}
            mode="multiple"
            // labelInValue={true}
            onChange={(value, options?) => {
              let newSelectedColors: SelectedProps[] = [];
              formProps;

              if (Array.isArray(options)) {
                newSelectedColors = options.map((item) => ({
                  value: item.value as string,
                  label: item.label as string,
                }));
              }
              setSelectedColors(newSelectedColors);
              // Cập nhật danh sách fileLists để tránh mất dữ liệu khi chọn thêm màu
              setFileLists((prev) => {
                const updatedFileLists = { ...prev };
                newSelectedColors.forEach((color) => {
                  if (!updatedFileLists[color.value]) {
                    updatedFileLists[color.value] = [];
                  }
                });
                return updatedFileLists;
              });
            }}
          />
        </Form.Item>

        {selectedColors.map((color) => (
          <Form.Item
            key={color.value}
            label={
              <>
                <span>Upload image&nbsp;</span>
                <span style={{ fontWeight: 500, fontSize: 16 }}>
                  {color.label}
                </span>
              </>
            }
          >
            <Upload
              listType="picture-card"
              fileList={fileLists[color.value] || []}
              onPreview={handlePreview}
              onChange={handleChange(color.value)}
              multiple={true}
              maxCount={6}
            >
              {fileLists[color.value]?.length >= 6 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Create>
  );
}
