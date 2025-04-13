import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Create FastAPI app instance
app = FastAPI(title="Basic API", description="A simple API with logging")

# Middleware for request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Get client IP and requested path
    client_ip = request.client.host
    path = request.url.path
    
    logger.info(f"Request received - Method: {request.method} Path: {path} Client: {client_ip}")
    
    # Process the request
    response = await call_next(request)
    
    # Calculate request processing time
    process_time = time.time() - start_time
    logger.info(f"Request completed in {process_time:.4f}s - Status: {response.status_code}")
    
    return response

# Basic endpoint
@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Hello World"}

# Health check endpoint
@app.get("/health")
async def health_check():
    logger.info("Health check performed")
    return {"status": "healthy"}

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error"}
    )

if __name__ == "__main__":
    logger.info("Starting server")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
