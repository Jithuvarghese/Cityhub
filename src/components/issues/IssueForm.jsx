import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import LocationPicker from '../map/LocationPicker';
import { ISSUE_CATEGORIES, URGENCY_LEVELS, URGENCY_CONFIG } from '../../utils/constants';
import apiService from '../../services/api';
import imageCompression from 'browser-image-compression';
import { IMAGE_COMPRESSION_OPTIONS } from '../../utils/constants';

/**
 * Multi-step Issue Report Form
 */
const IssueForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const totalSteps = 4;

  // Handle photo upload
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (photos.length + files.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    try {
      const compressedFiles = await Promise.all(
        files.map(file => imageCompression(file, IMAGE_COMPRESSION_OPTIONS))
      );

      setPhotos([...photos, ...compressedFiles]);

      // Create preview URLs
      const previews = compressedFiles.map(file => URL.createObjectURL(file));
      setPhotoPreview([...photoPreview, ...previews]);
    } catch (error) {
      console.error('Error compressing images:', error);
      toast.error('Failed to process images');
    }
  };

  // Remove photo
  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreview.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoPreview(newPreviews);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    if (!location) {
      toast.error('Please select a location');
      return;
    }

    setSubmitting(true);

    try {
      // Upload images first (mock)
      let uploadedPhotos = [];
      if (photos.length > 0) {
        const uploadResponse = await apiService.uploadImages(photos);
        uploadedPhotos = uploadResponse.data.map(img => img.url);
      }

      // Create issue
      const issueData = {
        title: data.title,
        description: data.description,
        category: selectedCategory,
        urgency: data.urgency,
        location: location,
        photos: uploadedPhotos.length > 0 ? uploadedPhotos : photoPreview
      };

      await apiService.createIssue(issueData);
      
      toast.success('Issue reported successfully!');
      navigate('/my-issues');
    } catch (error) {
      console.error('Error submitting issue:', error);
      toast.error('Failed to submit issue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep === 1 && !selectedCategory) {
      toast.error('Please select a category');
      return;
    }
    if (currentStep === 2 && !location) {
      toast.error('Please select a location on the map');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Progress indicator
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {[1, 2, 3, 4].map(step => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-semibold
              ${currentStep >= step 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }
            `}>
              {step}
            </div>
            <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center">
              {step === 1 && 'Category'}
              {step === 2 && 'Location'}
              {step === 3 && 'Details'}
              {step === 4 && 'Review'}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-primary-600 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
      <ProgressBar />

      {/* Step 1: Category Selection */}
      {currentStep === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Select Issue Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ISSUE_CATEGORIES.map(category => (
              <Card
                key={category.id}
                padding="md"
                hover
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  cursor-pointer transition-all
                  ${selectedCategory === category.id 
                    ? 'ring-4 ring-primary-500 border-primary-500' 
                    : 'hover:border-primary-300'
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Location Selection */}
      {currentStep === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Select Location
          </h2>
          <Card padding="md">
            <LocationPicker
              value={location ? [location.lat, location.lng] : null}
              onChange={setLocation}
              height="500px"
            />
          </Card>
        </div>
      )}

      {/* Step 3: Details */}
      {currentStep === 3 && (
        <div className="animate-fade-in space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Provide Details
          </h2>
          
          <Card padding="md" className="space-y-6">
            {/* Title */}
            <Input
              label="Title"
              name="title"
              placeholder="Brief description of the issue"
              required
              error={errors.title?.message}
              {...register('title', { 
                required: 'Title is required',
                minLength: { value: 10, message: 'Title must be at least 10 characters' }
              })}
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Provide detailed information about the issue..."
                className="input"
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 20, message: 'Description must be at least 20 characters' }
                })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(URGENCY_CONFIG).map(([key, config]) => (
                  <label
                    key={key}
                    className={`
                      flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all
                      ${watch('urgency') === key 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={key}
                      className="sr-only"
                      {...register('urgency', { required: 'Please select urgency level' })}
                    />
                    <span className="text-sm font-medium">{config.label}</span>
                  </label>
                ))}
              </div>
              {errors.urgency && (
                <p className="mt-1 text-sm text-red-600">{errors.urgency.message}</p>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Photos (Optional, max 5)
              </label>
              
              {/* Preview */}
              {photoPreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                  {photoPreview.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {photos.length < 5 && (
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <div className="animate-fade-in space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Review & Submit
          </h2>
          
          <Card padding="md" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Category</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{ISSUE_CATEGORIES.find(c => c.id === selectedCategory)?.icon}</span>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {ISSUE_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</h3>
              <p className="text-gray-900 dark:text-gray-100">{location?.address || 'Selected on map'}</p>
              <p className="text-sm text-gray-500">📍 {location?.lat.toFixed(6)}, {location?.lng.toFixed(6)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Title</h3>
              <p className="text-gray-900 dark:text-gray-100">{watch('title')}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h3>
              <p className="text-gray-900 dark:text-gray-100">{watch('description')}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Urgency</h3>
              <span className={`badge ${URGENCY_CONFIG[watch('urgency')]?.color}`}>
                {URGENCY_CONFIG[watch('urgency')]?.label}
              </span>
            </div>

            {photoPreview.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Photos</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {photoPreview.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="secondary"
          onClick={prevStep}
          disabled={currentStep === 1 || submitting}
        >
          ← Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button
            type="button"
            variant="primary"
            onClick={nextStep}
          >
            Next →
          </Button>
        ) : (
          <Button
            type="submit"
            variant="success"
            loading={submitting}
            disabled={submitting}
          >
            Submit Issue
          </Button>
        )}
      </div>
    </form>
  );
};

export default IssueForm;
