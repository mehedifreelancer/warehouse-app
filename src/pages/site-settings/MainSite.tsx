import { useState, useEffect } from 'react';
import InputText from '../../components/ui/input/InputText';
import Button from '../../components/ui/Button';
import { Save } from 'lucide-react';
import type { MainSite } from '../../types/site-settings/main-site.types';
import { getMainSite, updateMainSite } from '../../services/site-settings/main-site.service';

const MainSite = () => {
  const [initialData, setInitialData] = useState<MainSite | null>(null);
  const [loading, setLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await getMainSite();
      setInitialData(data);
    };
    loadData();
  }, [reloadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    try {
      await updateMainSite(formData);
      setReloadData(!reloadData);
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6 bg-[white] dark:bg-[#1e2939] p-10 rounded-lg shadow-md"
      encType="multipart/form-data"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <InputText
            name="name"
            label="Site Name"
            defaultValue={initialData.name}
            placeholder="Enter site name"
          />
          <InputText
            name="site_url"
            label="Site URL"
            defaultValue={initialData.site_url}
            placeholder="https://example.com"
          />
          <InputText
            name="description"
            label="Description"
            defaultValue={initialData.description}
            placeholder="Site description"
          />
          <InputText
            name="keyword"
            label="Keywords"
            defaultValue={initialData.keyword}
            placeholder="comma,separated,keywords"
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <InputText
            name="author"
            label="Author"
            defaultValue={initialData.author}
            placeholder="Site author"
          />
          <InputText
            name="email"
            label="Email"
            defaultValue={initialData.email}
            placeholder="contact@example.com"
            type="email"
          />
          <InputText
            name="helpline_number"
            label="Helpline Number"
            defaultValue={initialData.helpline_number}
            placeholder="+880XXXXXXXXXX"
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Content</h3>
        <InputText
          name="address"
          label="Address"
          defaultValue={initialData.address}
          placeholder="<p>Enter HTML address</p>"
        />
        <InputText
          name="short_description"
          label="Short Description"
          defaultValue={initialData.short_description}
          placeholder="<p>Brief description</p>"
        />
      </div>

      {/* Images Section - Changed to file inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Logos</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Header Logo
            </label>
            <input
              type="file"
              name="header_logo"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {initialData.header_logo && (
              <p className="mt-1 text-sm text-gray-500">Current: {initialData.header_logo}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Footer Logo
            </label>
            <input
              type="file"
              name="footer_logo"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {initialData.footer_logo && (
              <p className="mt-1 text-sm text-gray-500">Current: {initialData.footer_logo}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Icons</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Favicon
            </label>
            <input
              type="file"
              name="favicon"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {initialData.favicon && (
              <p className="mt-1 text-sm text-gray-500">Current: {initialData.favicon}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              16x16 Icon
            </label>
            <input
              type="file"
              name="icon_16"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {initialData.icon_16 && (
              <p className="mt-1 text-sm text-gray-500">Current: {initialData.icon_16}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              32x32 Icon
            </label>
            <input
              type="file"
              name="icon_32"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {initialData.icon_32 && (
              <p className="mt-1 text-sm text-gray-500">Current: {initialData.icon_32}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Apple Touch Icon
          </label>
          <input
            type="file"
            name="apple_touch_icon"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {initialData.apple_touch_icon && (
            <p className="mt-1 text-sm text-gray-500">Current: {initialData.apple_touch_icon}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Safari Pinned Tab Icon
          </label>
          <input
            type="file"
            name="safari_pinned"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {initialData.safari_pinned && (
            <p className="mt-1 text-sm text-gray-500">Current: {initialData.safari_pinned}</p>
          )}
        </div>
      </div>

      {/* Maintenance Mode Toggle */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="maintenance_mode"
          name="maintenance_mode"
          defaultChecked={initialData.maintenance_mode}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Maintenance Mode
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (
            <>
              <Save size={18} className="mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default MainSite;