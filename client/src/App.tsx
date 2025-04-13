import React, { useState, ChangeEvent, FormEvent } from 'react';
import { EngineTemplateRequest, EngineFramework } from './types';
import { generateEngineTemplate, downloadFile } from './services/apiService';

function App() {
  const [formData, setFormData] = useState<EngineTemplateRequest>({
    engine_name: '',
    version: '',
    author: '',
    description: '',
    include_examples: true,
    framework: EngineFramework.UNITY
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * Handles form input changes
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      // Call API service to generate the template
      const blob = await generateEngineTemplate(formData);
      
      // Download the file
      downloadFile(blob, `${formData.engine_name}-game-engine.zip`);
      
      setSuccessMessage('Engine template generated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-blue-600">
            Game Engine Template Generator
          </h1>
        </header>
        
        <main>
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 mb-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-400 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-400 rounded-md">
                <p className="text-green-700">{successMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="engine_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Engine Name *
                </label>
                <input
                  type="text"
                  id="engine_name"
                  name="engine_name"
                  value={formData.engine_name}
                  onChange={handleChange}
                  required
                  placeholder="awesome-game-engine"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                  Version *
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  required
                  placeholder="1.0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  placeholder="Game Developer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="An awesome 3D game engine"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="include_examples"
                  name="include_examples"
                  checked={formData.include_examples}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="include_examples" className="ml-2 block text-sm text-gray-700">
                  Include Example Files
                </label>
              </div>
              
              <div className="mb-8">
                <label htmlFor="framework" className="block text-sm font-medium text-gray-700 mb-1">
                  Framework *
                </label>
                <select
                  id="framework"
                  name="framework"
                  value={formData.framework}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={EngineFramework.UNITY}>Unity</option>
                  <option value={EngineFramework.UNREAL}>Unreal Engine</option>
                  <option value={EngineFramework.CUSTOM}>Custom</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Engine Template'}
              </button>
            </form>
          </div>
        </main>
        
        <footer className="mt-12 text-center text-gray-500">
          <p>Game Engine Template Generator © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
