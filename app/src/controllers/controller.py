from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import logging

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

# @router.exception_handler(Exception)
# async def global_exception_handler(request: Request, exc: Exception):
#     logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
#     return JSONResponse(
#         status_code=500,
#         content={"message": "Internal server error"}
#     )
