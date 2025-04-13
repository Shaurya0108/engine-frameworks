from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse, FileResponse
import logging
from src.models.engine_template_model import EngineTemplateRequest
from src.services.engine_service import create_engine_template

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Hello World"}

@router.get("/health")
async def health_check():
    logger.info("Health check performed")
    return {"status": "healthy"}

@router.post("/engine-template")
async def engine_template(request: EngineTemplateRequest):
    """
    Generate a game engine template as a ZIP file based on provided parameters
    
    Args:
        request (EngineTemplateRequest): The request containing engine template parameters
        
    Returns:
        FileResponse: A ZIP file containing the engine template
    """
    logger.info(f"Game engine template requested for engine: {request.engine_name}")
    
    try:
        # Call service to create a simple template zip file
        zip_path = await create_engine_template(
            engine_name=request.engine_name,
            version=request.version,
            author=request.author,
            description=request.description,
            include_examples=request.include_examples,
            framework=request.framework
        )
        
        # Return the zip file
        return FileResponse(
            path=zip_path,
            filename=f"{request.engine_name}-game-engine.zip",
            media_type="application/zip"
        )
    except Exception as e:
        logger.error(f"Error generating game engine template: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate game engine template: {str(e)}")
