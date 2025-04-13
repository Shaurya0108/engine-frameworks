from pydantic import BaseModel, Field
from typing import Optional

class EngineTemplateRequest(BaseModel):
    engine_name: str = Field(..., description="Name of the game engine")
    version: str = Field(..., description="Version of the game engine")
    author: str = Field(..., description="Author of the game engine")
    description: Optional[str] = Field(None, description="Description of the game engine")
    include_examples: bool = Field(True, description="Include example game files")
    framework: str = Field(..., description="Framework to use (e.g., unity, unreal, custom)")
    
    class Config:
        schema_extra = {
            "example": {
                "engine_name": "awesome-game-engine",
                "version": "1.0.0",
                "author": "Game Developer",
                "description": "An awesome 3D game engine",
                "include_examples": True,
                "framework": "unity"
            }
        }
