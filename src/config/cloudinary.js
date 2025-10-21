// Cloudinary Configuration
// Using the provided CLOUDINARY_URL: cloudinary://<your_api_key>:<your_api_secret>@dxwfgpcno

export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dxwfgpcno", // Extracted from the CLOUDINARY_URL
  UPLOAD_PRESET: "react_project_images", // Your new unsigned upload preset
  API_BASE_URL: "https://api.cloudinary.com/v1_1"
};

// IMPORTANT: You need to create an unsigned upload preset in your Cloudinary dashboard:
// 1. Go to your Cloudinary dashboard: https://cloudinary.com/console
// 2. Navigate to Settings > Upload
// 3. Scroll down to "Upload presets" section
// 4. Click "Add upload preset"
// 5. Give it a name (e.g., "react-uploads")
// 6. Set "Signing Mode" to "Unsigned"
// 7. Click "Save"
// 8. Replace the UPLOAD_PRESET value above with your custom preset name

// Configuration is now set up with your new unsigned upload preset
// This should resolve the "Bad Request" error you were experiencing 