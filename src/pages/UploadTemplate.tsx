import { Card, Header, Label, LoadingButton } from "../components";
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { apiEndPoints } from "../services/apiEndPoints";

const UploadTemplate: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: any) => {
    if (!file || !data.templateName) return;
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', data.templateName);
      await axios.post(apiEndPoints.uploadTemplate, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setFile(null);
      setValue('templateName', '');
    }
  };

  return (
    <Card>
      <Header>Upload Template</Header>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="templateName">Template Name</Label>
          <Controller
            name="templateName"
            control={control}
            defaultValue=""
            rules={{ required: 'Template name is required' }}
            render={({ field }) => (
              <input
                {...field}
                id="templateName"
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter template name"
              />
            )}
          />
          {errors.templateName && typeof errors.templateName.message === 'string' && (
            <span className="text-red-500">{errors.templateName.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="templateImage">Template Image</Label>
          <input
            id="templateImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
            required
          />
          {errors.templateImage && typeof errors.templateImage.message === 'string' && (
            <span className="text-red-500">{errors.templateImage.message}</span>
          )}
        </div>

        <LoadingButton
          isLoading={isLoading}
          text="Upload Template"
          activeClassName="bg-blue-600 hover:bg-blue-700"
          disabledClassName="bg-gray-400 cursor-not-allowed"
        />
      </form>
    </Card>
  );
};

export default UploadTemplate;
