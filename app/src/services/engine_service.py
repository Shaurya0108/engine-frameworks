import logging
import os
import tempfile
import zipfile
import shutil
from typing import Optional
import json
from datetime import datetime

logger = logging.getLogger(__name__)

async def create_engine_template(
    engine_name: str, 
    version: str, 
    author: str, 
    description: Optional[str] = None, 
    include_examples: bool = True, 
    framework: str = "pytorch"
) -> str:
    """
    Create a simple engine template and return the path to the zip file
    
    Args:
        engine_name: Name of the engine
        version: Version of the engine
        author: Author of the engine
        description: Description of the engine
        include_examples: Whether to include example files
        framework: Framework to use (e.g., pytorch, tensorflow)
        
    Returns:
        str: Path to the generated zip file
    """
    logger.info(f"Creating engine template for '{engine_name}' using {framework}")
    
    # Create temporary directory
    temp_dir = tempfile.mkdtemp()
    try:
        # Create zip file path
        zip_path = os.path.join(temp_dir, f"{engine_name}-template.zip")
        
        # Create a simple ZIP with metadata file
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            # Add a metadata.json file
            metadata = {
                "name": engine_name,
                "version": version,
                "author": author,
                "description": description or f"Game engine template for {engine_name}",
                "framework": framework,
                "created_at": datetime.now().isoformat(),
                "include_examples": include_examples
            }
            
            metadata_str = json.dumps(metadata, indent=2)
            zipf.writestr("metadata.json", metadata_str)
            
            # Add a simple README file
            readme_content = f"""# {engine_name} Game Engine

{description or f"A game engine template for {engine_name}"}

## Overview

This is a game engine template for {engine_name} version {version}.

## Installation

Follow the instructions in the documentation to install this game engine.

## Author

{author}
"""
            zipf.writestr("README.md", readme_content)
            
            # Add a placeholder configuration file
            config = {
                "engine": {
                    "name": engine_name,
                    "version": version
                },
                "settings": {
                    "defaultFPS": 60,
                    "physics": {
                        "enabled": True,
                        "gravity": 9.8
                    },
                    "rendering": {
                        "defaultResolution": "1080p",
                        "shadows": True,
                        "antialiasing": True
                    }
                }
            }
            zipf.writestr("config.json", json.dumps(config, indent=2))
            
            # Add empty placeholder directories structure
            zipf.writestr("src/", "")
            zipf.writestr("assets/", "")
            zipf.writestr("docs/", "")
            
            # Add a basic engine file
            if framework.lower() == "unity":
                engine_file = "// Unity-based game engine starter\n// This is a placeholder for your Unity integration code"
                zipf.writestr("src/UnityIntegration.cs", engine_file)
            elif framework.lower() == "unreal":
                engine_file = "// Unreal-based game engine starter\n// This is a placeholder for your Unreal Engine integration code"
                zipf.writestr("src/UnrealIntegration.cpp", engine_file)
            else:
                engine_file = "// Custom game engine starter\n// This is a placeholder for your custom engine code"
                zipf.writestr("src/Engine.cpp", engine_file)
            
            # Add an example if requested
            if include_examples:
                example = """// Example game implementation
// This is a placeholder for a simple game using this engine
"""
                zipf.writestr("examples/SimpleGame.cpp", example)
                
                # Add a sample asset placeholder
                zipf.writestr("examples/assets/placeholder.txt", "This is a placeholder for game assets.")
        
        logger.info(f"Engine template created at {zip_path}")
        return zip_path
        
    except Exception as e:
        # Clean up in case of error
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        logger.error(f"Error creating engine template: {str(e)}")
        raise e
