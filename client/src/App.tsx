import React, { useState, ChangeEvent, FormEvent } from 'react';
import './App.css';
import { EngineTemplateRequest } from './types';

function App() {
  const [formData, setFormData] = useState<EngineTemplateRequest>({
    engine_name: '',
    version: '',
    author: '',
    description: '',
    include_examples: true,
    framework: 'unity'
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      // Make API call to your FastAPI backend
      const response = await fetch('http://localhost:8000/engine-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate engine template');
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.engine_name}-game-engine.zip`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccessMessage('Engine template generated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Game Engine Template Generator</h1>
      </header>
      
      <main>
        <section className="form-container">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="success-message">
              <p>{successMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="engine_name">Engine Name *</label>
              <input
                type="text"
                id="engine_name"
                name="engine_name"
                value={formData.engine_name}
                onChange={handleChange}
                required
                placeholder="awesome-game-engine"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="version">Version *</label>
              <input
                type="text"
                id="version"
                name="version"
                value={formData.version}
                onChange={handleChange}
                required
                placeholder="1.0.0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Game Developer"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="An awesome 3D game engine"
                rows={3}
              ></textarea>
            </div>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="include_examples"
                name="include_examples"
                checked={formData.include_examples}
                onChange={handleChange}
              />
              <label htmlFor="include_examples">Include Example Files</label>
            </div>
            
            <div className="form-group">
              <label htmlFor="framework">Framework *</label>
              <select
                id="framework"
                name="framework"
                value={formData.framework}
                onChange={handleChange}
                required
              >
                <option value="unity">Unity</option>
                <option value="unreal">Unreal Engine</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="generate-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Engine Template'}
            </button>
          </form>
        </section>
      </main>
      
      <footer>
        <p>Game Engine Template Generator © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
