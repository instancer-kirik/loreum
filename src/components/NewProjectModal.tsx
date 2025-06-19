import React, { useState } from 'react';
import { FaTimes, FaGlobe, FaRocket, FaClock, FaMapMarkedAlt } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { createHierarchy, isLoading } = useAppContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    multiverseName: '',
    multiverseDescription: '',
    universeName: '',
    universeDescription: '',
    timelineName: '',
    timelineDescription: '',
    timelineStartYear: 2300,
    timelineEndYear: 3000,
    worldName: '',
    worldDescription: '',
    worldType: 'planet'
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      await createHierarchy(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        multiverseName: '',
        multiverseDescription: '',
        universeName: '',
        universeDescription: '',
        timelineName: '',
        timelineDescription: '',
        timelineStartYear: 2300,
        timelineEndYear: 3000,
        worldName: '',
        worldDescription: '',
        worldType: 'planet'
      });
      setStep(1);
    } catch (error) {
      console.error('Failed to create project hierarchy:', error);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.multiverseName.trim() && formData.multiverseDescription.trim();
      case 2:
        return formData.universeName.trim() && formData.universeDescription.trim();
      case 3:
        return formData.timelineName.trim() && formData.timelineDescription.trim() && formData.timelineStartYear;
      case 4:
        return formData.worldName.trim() && formData.worldDescription.trim() && formData.worldType;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-900 bg-opacity-30 rounded-full flex items-center justify-center">
              <FaRocket className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
              <p className="text-sm text-gray-400">Step {step} of 4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNumber <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`flex-1 h-1 rounded ${
                      stepNumber < step ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaGlobe className="h-6 w-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Multiverse</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Multiverse Name
                </label>
                <input
                  type="text"
                  value={formData.multiverseName}
                  onChange={(e) => handleInputChange('multiverseName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the name of your multiverse"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.multiverseDescription}
                  onChange={(e) => handleInputChange('multiverseDescription', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the fundamental nature and scope of your multiverse"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <h3 className="text-lg font-semibold text-white">Universe</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Universe Name
                </label>
                <input
                  type="text"
                  value={formData.universeName}
                  onChange={(e) => handleInputChange('universeName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the name of your universe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.universeDescription}
                  onChange={(e) => handleInputChange('universeDescription', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the physical laws, structure, and characteristics of this universe"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaClock className="h-6 w-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Timeline</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeline Name
                </label>
                <input
                  type="text"
                  value={formData.timelineName}
                  onChange={(e) => handleInputChange('timelineName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the name of your timeline"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.timelineDescription}
                  onChange={(e) => handleInputChange('timelineDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the historical context and major events of this timeline"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Year
                  </label>
                  <input
                    type="number"
                    value={formData.timelineStartYear}
                    onChange={(e) => handleInputChange('timelineStartYear', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Year (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.timelineEndYear}
                    onChange={(e) => handleInputChange('timelineEndYear', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaMapMarkedAlt className="h-6 w-6 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">World</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  World Name
                </label>
                <input
                  type="text"
                  value={formData.worldName}
                  onChange={(e) => handleInputChange('worldName', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the name of your world"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.worldDescription}
                  onChange={(e) => handleInputChange('worldDescription', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the geography, environment, and characteristics of this world"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  World Type
                </label>
                <select
                  value={formData.worldType}
                  onChange={(e) => handleInputChange('worldType', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planet">Planet</option>
                  <option value="ringworld">Ringworld</option>
                  <option value="dyson_sphere">Dyson Sphere</option>
                  <option value="habitat">Habitat</option>
                  <option value="station">Station</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};