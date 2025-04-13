export interface EngineTemplateRequest {
    engine_name: string;
    version: string;
    author: string;
    description: string;
    include_examples: boolean;
    framework: string;
}
  
export interface ApiError {
    detail: string;
}
