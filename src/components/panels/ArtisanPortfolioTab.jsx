import { useRef, useState ,useEffect} from 'react';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { useAuthStore } from '../../store/useAuthStore';

export default function ArtisanPortfolioSection({ profile, refreshProfile }) {
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { user, fetchUserData } = useAuthStore();
    useEffect(() => {
      fetchUserData();
    }, []);


    const handleDeleteUploadedImage = async (imageUrl) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this image?');
        if (!confirmDelete) return;
      
        try {
          await axiosInstance.delete('/upload/artisan-images', {
            data: { imageUrl },
          });
      
          toast.success('Image removed');
      
          // Refetch user profile to update state
          fetchUserData();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete image');
        }
      };
      
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);

    const totalSelected = selected.length + (profile?.portfolioImages?.length || 0) + files.length;
    if (totalSelected > 10) {
      toast.error('You can only upload up to 10 portfolio images in total');
      return;
    }

    const newPreviews = selected.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...selected]);
    setPreview((prev) => [...prev, ...newPreviews]);
  };

  const removeFileAt = (index) => {
    const updatedFiles = [...files];
    const updatedPreview = [...preview];
    updatedFiles.splice(index, 1);
    updatedPreview.splice(index, 1);
  
    setFiles(updatedFiles);
    setPreview(updatedPreview);
  
    if (updatedPreview.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async () => {
    if (files.length === 0) return;
  
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
  
    setUploading(true);
    try {
      await axiosInstance.post('/upload/artisan-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      toast.success('Portfolio images uploaded!');
      
      // Clear previews and file input
      setFiles([]);
      setPreview([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
  
      refreshProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };


  return (
    <section className="bg-white p-6 rounded shadow space-y-4">
      <h3 className="text-lg font-semibold text-charcoal">Portfolio Images</h3>

      {/* Upload Input */}
    <div
      onClick={() => fileInputRef.current?.click()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
    >
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="text-gray-600">
        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop<br />
        <span className="text-sm text-gray-500">PNG, JPG up to 5MB each</span>
      </p>
    </div>


      {/* Preview Selected Images with Remove Option */}
      {preview.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {preview.map((item, index) => (
            <div key={index} className="relative group">
              <img
                src={item.previewUrl}
                alt="Preview"
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeFileAt(index)}
                className="absolute top-[-8px] right-[-8px] bg-white border rounded-full p-1 shadow hover:bg-red-100 text-red-600"
                title="Remove"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Selected Images'}
      </button>

   {/* Portfolio Section */}
      <h3 className="text-lg font-semibold text-charcoal mb-2">Portfolio</h3>
      <div className="flex gap-2 overflow-x-auto">
        {profile?.portfolioImages.map((img, i) => (
          <div key={i} className="relative">
            <img
              src={img}
              alt="Portfolio"
              className="w-80 h-80 object-cover rounded"
            />
            <button
              onClick={() => handleDeleteUploadedImage(img)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5 hover:bg-red-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>    
    </section>

    
  );
}
