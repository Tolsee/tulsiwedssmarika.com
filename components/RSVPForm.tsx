'use client';

import { useState } from 'react';

interface RSVPFormData {
  name: string;
  email: string;
  attending: boolean | null;
  guests: number;
  mealPreference: string;
  dietaryRequirements: string;
  message: string;
}

export default function RSVPForm() {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    email: '',
    attending: null,
    guests: 1,
    mealPreference: '',
    dietaryRequirements: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    attending?: string;
    guests?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      attending?: string;
      guests?: string;
    } = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.attending === null) {
      newErrors.attending = 'Please let us know if you will be attending';
    }

    if (formData.attending && (formData.guests < 1 || formData.guests > 10)) {
      newErrors.guests = 'Number of guests must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Cloudflare Worker API endpoint
      const response = await fetch('https://tulsiwedssmarika.com/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your RSVP has been submitted successfully. 💖',
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          attending: null,
          guests: 1,
          mealPreference: '',
          dietaryRequirements: '',
          message: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit RSVP. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof RSVPFormData,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="card">
      {submitStatus.type && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-2">
            Full Name(s) *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors ${
              errors.name ? 'border-red-300' : 'border-emerald-200'
            }`}
            placeholder="Your name (or names for couples)"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors ${
              errors.email ? 'border-red-300' : 'border-emerald-200'
            }`}
            placeholder="your@email.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Attendance Field */}
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-3">
            Will you be attending? *
          </label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="attending"
                checked={formData.attending === true}
                onChange={() => handleInputChange('attending', true)}
                className="text-emerald-500 focus:ring-emerald-400"
                disabled={isSubmitting}
              />
              <span className="ml-2 text-gray-700">Yes, I'll be there! 🎉</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="attending"
                checked={formData.attending === false}
                onChange={() => handleInputChange('attending', false)}
                className="text-emerald-500 focus:ring-emerald-400"
                disabled={isSubmitting}
              />
              <span className="ml-2 text-gray-700">Sorry, can't make it 😢</span>
            </label>
          </div>
          {errors.attending && (
            <p className="mt-1 text-sm text-red-600">{errors.attending}</p>
          )}
        </div>

        {/* Conditional Fields for Attending Guests */}
        {formData.attending && (
          <>
            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Number of Guests *
              </label>
              <select
                value={formData.guests}
                onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors ${
                  errors.guests ? 'border-red-300' : 'border-emerald-200'
                }`}
                disabled={isSubmitting}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
              {errors.guests && (
                <p className="mt-1 text-sm text-red-600">{errors.guests}</p>
              )}
            </div>

            {/* Meal Preference */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Meal Preference
              </label>
              <select
                value={formData.mealPreference}
                onChange={(e) => handleInputChange('mealPreference', e.target.value)}
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors"
                disabled={isSubmitting}
              >
                <option value="">Please select...</option>
                <option value="vegetarian">Vegetarian 🥗</option>
                <option value="non-vegetarian">Non-Vegetarian 🍗</option>
                <option value="vegan">Vegan 🌱</option>
              </select>
            </div>

            {/* Dietary Requirements */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Dietary Requirements / Allergies
              </label>
              <input
                type="text"
                value={formData.dietaryRequirements}
                onChange={(e) => handleInputChange('dietaryRequirements', e.target.value)}
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors"
                placeholder="Any allergies or special dietary needs?"
                disabled={isSubmitting}
              />
            </div>
          </>
        )}

        {/* Message Field */}
        <div>
          <label className="block text-sm font-medium text-emerald-700 mb-2">
            Special Message (Optional)
          </label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-colors"
            placeholder={formData.attending ? "Leave us a sweet message..." : "We'll miss you! Let us know your thoughts..."}
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn-primary w-full md:w-auto ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending RSVP...
              </span>
            ) : (
              'Send RSVP 💕'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}