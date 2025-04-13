import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import time

from src.controllers.controller import router

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
app = FastAPI(title="Basic API", description="A simple API with logging")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Middleware for request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Get client IP and requested path
    client_ip = request.client.host
    path = request.url.path
    
    logger.info(f"Request received - Method: {request.method} Path: {path} Client: {client_ip}")
    response = await call_next(request)
    
    # Calculate request processing time
    process_time = time.time() - start_time
    logger.info(f"Request completed in {process_time:.4f}s - Status: {response.status_code}")
    
    return response

if __name__ == "__main__":
    logger.info("Starting server")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
