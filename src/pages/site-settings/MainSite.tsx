import { useState, useEffect } from 'react';
import InputText from '../../components/ui/input/InputText';
import Button from '../../components/ui/Button';
import { Save } from 'lucide-react';
import type { MainSite } from '../../types/site-settings/main-site.types';
import { getMainSite, updateMainSite } from '../../services/site-settings/main-site.service';

const MainSite = () => {
  const [initialData, setInitialData] = useState<MainSite | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await getMainSite();
      setInitialData(data);
    };
    loadData();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await updateMainSite(formData);
      const updatedData = await getMainSite();
      setInitialData(updatedData);
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <form action={handleSubmit} className="space-y-6 bg-[white] dark:bg-[#1e2939] p-10 rounded-lg shadow-md">
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

      {/* Images Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Logos</h3>
          <InputText
            name="header_logo"
            label="Header Logo URL"
            defaultValue={initialData.header_logo}
            placeholder="http://example.com/logo.png"
          />
          <InputText
            name="footer_logo"
            label="Footer Logo URL"
            defaultValue={initialData.footer_logo}
            placeholder="http://example.com/footer-logo.png"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Icons</h3>
          <InputText
            name="favicon"
            label="Favicon URL"
            defaultValue={initialData.favicon}
            placeholder="http://example.com/favicon.ico"
          />
          <InputText
            name="icon_16"
            label="16x16 Icon URL"
            defaultValue={initialData.icon_16}
            placeholder="http://example.com/icon-16.png"
          />
          <InputText
            name="icon_32"
            label="32x32 Icon URL"
            defaultValue={initialData.icon_32}
            placeholder="http://example.com/icon-32.png"
          />
        </div>
      </div>

      {/* Additional Icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputText
          name="apple_touch_icon"
          label="Apple Touch Icon URL"
          defaultValue={initialData.apple_touch_icon}
          placeholder="http://example.com/apple-touch-icon.png"
        />
        <InputText
          name="safari_pinned"
          label="Safari Pinned Tab Icon URL"
          defaultValue={initialData.safari_pinned}
          placeholder="http://example.com/safari-pinned-tab.svg"
        />
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