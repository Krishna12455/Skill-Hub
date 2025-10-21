# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image and video uploads in your React project.

## Step 1: Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up" and create a free account (you can use your Google account)
3. Verify your email address

## Step 2: Get Your Cloud Name

1. Log in to your Cloudinary dashboard
2. Go to **Settings** (gear icon) → **API Keys**
3. Copy your **Cloud name** (it will look something like `dxyz12345`)

## Step 3: Enable Unsigned Uploads

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to the **Upload presets** section
3. Click **"Enable unsigned uploading"**
4. Click **"Add upload preset"**
5. Give your preset a name (e.g., "react-uploads")
6. Set **Signing Mode** to **"Unsigned"**
7. Click **"Save"**

## Step 4: Configure Your React Project

1. Open the file `src/config/cloudinary.js`
2. Replace the placeholder values with your actual credentials:

```javascript
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "your_actual_cloud_name", // Replace with your cloud name
  UPLOAD_PRESET: "your_actual_preset_name", // Replace with your preset name
  API_BASE_URL: "https://api.cloudinary.com/v1_1"
};
```

## Step 5: Test the Upload

1. Start your React development server
2. Navigate to the Post Video page
3. Fill out the form and upload an image thumbnail
4. If uploading a video lesson, select a video file
5. Click "Create Course"
6. You should see a progress bar showing the upload progress
7. Check your Cloudinary Media Library to verify the uploads

## Features

- **Image Upload**: Course thumbnails are uploaded to Cloudinary
- **Video Upload**: Video lessons are uploaded to Cloudinary
- **Progress Tracking**: Real-time upload progress with status messages
- **Error Handling**: Comprehensive error handling for upload failures
- **Secure URLs**: All uploaded files get secure HTTPS URLs

## File Structure

```
src/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
└── Dashboard/
    └── TeacherDashboard/
        └── Postvideo.jsx      # Main upload component
```

## Troubleshooting

### Upload Fails
- Check that your cloud name and upload preset are correct
- Ensure unsigned uploading is enabled
- Verify your internet connection
- Check browser console for error messages

### Large File Uploads
- Cloudinary free tier has file size limits
- Images: 10MB max
- Videos: 100MB max
- Consider compressing files before upload

### CORS Issues
- Cloudinary handles CORS automatically for unsigned uploads
- If you encounter CORS errors, check your upload preset settings

## Security Notes

- Never commit your actual Cloudinary credentials to version control
- Use environment variables in production
- The unsigned upload preset is safe for client-side uploads
- Consider implementing file type and size validation

## Production Deployment

For production, consider using environment variables:

```javascript
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  UPLOAD_PRESET: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  API_BASE_URL: "https://api.cloudinary.com/v1_1"
};
```

Then set these environment variables in your hosting platform. 