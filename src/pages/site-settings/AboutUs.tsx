import { useState, useEffect, useRef } from 'react';
import Button from '../../components/ui/Button';
import { Save } from 'lucide-react';
import { Editor } from 'primereact/editor';
import { getAboutUs, updateAboutUs } from '../../services/site-settings/about-us.service';

const AboutUs = () => {
  const [aboutData, setAboutData] = useState<{
    content: string;
    image?: string;
  }>({ content: '' });
  const [loading, setLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAboutUs();
        console.log('About Us Data:', data);
        setAboutData({
          content: data?.about_us || '',
          image: data.image
        });
      } catch (error) {
        console.error('Error loading about us data:', error);
      }
    };
    loadData();
  }, [reloadData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    
    // Add the editor content
    if (aboutData.content) {
      formData.append('about_us', aboutData.content);
    }
    
    // Add the image file if it exists
    if (fileInputRef.current?.files?.[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }
    
    try {
      await updateAboutUs(formData);
      setSelectedImage(null); // Clear the selected image preview after upload
      setReloadData(!reloadData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6 bg-[white] dark:bg-[#1e2939] p-10 rounded-lg shadow-md"
      encType="multipart/form-data"
    >
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Update About Us Content</h3>
        </div>
        
        {/* Rich Text Editor */}
        <div className="card">
          <Editor 
            value={aboutData.content} 
            onTextChange={(e) => setAboutData(prev => ({
              ...prev,
              content: e.htmlValue || ''
            }))} 
            style={{ height: '320px' }} 
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            About Us Image
          </label>
          <input
            type="file"
            name="image"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          
          {/* Show either the selected image preview or the current image */}
          {selectedImage ? (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">New Image Preview:</p>
              <img 
                src={selectedImage} 
                alt="Selected About Us" 
                className="max-w-full h-auto max-h-60 rounded-md"
              />
            </div>
          ) : aboutData.image ? (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Current Image:</p>
              <img 
                src={aboutData.image} 
                alt="Current About Us" 
                className="max-w-full h-auto max-h-60 rounded-md"
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (
            <>
              <Save size={18} className="mr-2" />
              Save Content
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AboutUs;