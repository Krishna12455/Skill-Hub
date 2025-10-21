# Cloudinary Upload Troubleshooting Guide

## Error: "Upload failed: Bad Request"

This error typically occurs due to one of these issues:

### 1. Upload Preset Not Configured

**Problem**: The upload preset doesn't exist or isn't configured for unsigned uploads.

**Solution**:
1. Go to your Cloudinary dashboard: https://cloudinary.com/console
2. Navigate to **Settings** → **Upload**
3. Scroll down to **"Upload presets"** section
4. Click **"Add upload preset"**
5. Configure the preset:
   - **Preset name**: Choose a name (e.g., "react-uploads")
   - **Signing Mode**: Select **"Unsigned"**
   - **Folder**: Leave empty or set a folder name
   - **Access Mode**: Select **"Public"**
6. Click **"Save"**
7. Update your `src/config/cloudinary.js` file with the new preset name

### 2. Check Your Current Configuration

Open your browser's developer console (F12) and look for these logs when uploading:

```javascript
// You should see something like:
Uploading to Cloudinary: {
  cloudName: "dxwfgpcno",
  uploadPreset: "your_preset_name",
  fileType: "image",
  fileName: "example.jpg",
  fileSize: 123456
}
```

### 3. Test with Different Upload Presets

Try these common preset names in your `src/config/cloudinary.js`:

```javascript
// Option 1: Use your cloud name
UPLOAD_PRESET: "dxwfgpcno"

// Option 2: Use a common default
UPLOAD_PRESET: "ml_default"

// Option 3: Use a custom preset (recommended)
UPLOAD_PRESET: "react-uploads" // Replace with your actual preset name
```

### 4. Verify Cloudinary Account Status

1. Check if your Cloudinary account is active
2. Verify you haven't exceeded upload limits
3. Ensure your cloud name is correct: `dxwfgpcno`

### 5. Test with Simple Upload

Use the test component at `/test-cloudinary` to isolate the issue:

1. Open browser developer tools (F12)
2. Go to the Console tab
3. Try uploading a small image file
4. Check the console logs for detailed error information

### 6. Common Error Messages and Solutions

| Error Message | Solution |
|---------------|----------|
| "Upload preset not found" | Create a new upload preset |
| "Invalid upload preset" | Check preset name spelling |
| "Upload preset not allowed" | Set signing mode to "Unsigned" |
| "File too large" | Reduce file size (max 10MB for images, 100MB for videos) |
| "Invalid file type" | Check file format is supported |

### 7. Quick Fix Steps

1. **Create Upload Preset**:
   - Dashboard → Settings → Upload → Upload presets
   - Add preset: Name="react-uploads", Signing="Unsigned"

2. **Update Configuration**:
   ```javascript
   // src/config/cloudinary.js
   export const CLOUDINARY_CONFIG = {
     CLOUD_NAME: "dxwfgpcno",
     UPLOAD_PRESET: "react-uploads", // Your new preset name
     API_BASE_URL: "https://api.cloudinary.com/v1_1"
   };
   ```

3. **Test Upload**:
   - Use the test component
   - Check browser console for detailed logs
   - Try with a small JPEG image first

### 8. Still Having Issues?

If the problem persists:

1. Check the browser console for detailed error logs
2. Verify your Cloudinary account is active
3. Try uploading directly to Cloudinary dashboard to test
4. Contact Cloudinary support if needed

### 9. Alternative: Use Signed Uploads

If unsigned uploads continue to fail, you can implement signed uploads:

```javascript
// This requires backend implementation
// For now, focus on getting unsigned uploads working
```

## Success Indicators

When working correctly, you should see:
- ✅ Console logs showing upload progress
- ✅ Success response with secure URL
- ✅ File appears in your Cloudinary Media Library
- ✅ Course created successfully in Firebase 