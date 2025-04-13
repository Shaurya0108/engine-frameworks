// src/types.ts

/**
 * Enum for supported engine frameworks
 */
export enum EngineFramework {
    UNITY = "unity",
    UNREAL = "unreal",
    CUSTOM = "custom"
  }
  
  /**
   * Interface for engine template request payload
   */
  export interface EngineTemplateRequest {
    engine_name: string;
    version: string;
    author: string;
    description: string;
    include_examples: boolean;
    framework: string;
  }
  
  /**
   * Interface for API error response
   */
  export interface ApiError {
    detail: string;
  }
  
  /**
   * Interface for form field validation
   */
  export interface FieldValidation {
    isValid: boolean;
    message: string;
  }
  
  /**
   * Interface for form validation state
   */
  export interface FormValidationState {
    engine_name?: FieldValidation;
    version?: FieldValidation;
    author?: FieldValidation;
  }
