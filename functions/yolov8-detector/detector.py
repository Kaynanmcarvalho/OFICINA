"""
YOLOv8 Car Damage Detector API
FastAPI service for detecting vehicle damages

@author Torq AI Team
@version 1.0.0
"""

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from ultralytics import YOLO
import base64
import numpy as np
import cv2
from io import BytesIO
from PIL import Image
import logging
import time
import os
from typing import List, Optional

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="YOLOv8 Car Damage Detector",
    description="AI-powered vehicle damage detection using YOLOv8",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
MODEL_PATH = os.getenv("MODEL_PATH", "yolov8n.pt")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.45"))
IOU_THRESHOLD = float(os.getenv("IOU_THRESHOLD", "0.45"))
MAX_DETECTIONS = int(os.getenv("MAX_DETECTIONS", "100"))

# Load model
model = None
model_loaded = False

def load_model():
    """Load YOLOv8 model"""
    global model, model_loaded
    try:
        logger.info(f"Loading model: {MODEL_PATH}")
        model = YOLO(MODEL_PATH)
        model_loaded = True
        logger.info(f"✅ Model loaded successfully: {MODEL_PATH}")
        
        # Warm up model
        logger.info("Warming up model...")
        dummy_image = np.zeros((640, 640, 3), dtype=np.uint8)
        model(dummy_image, verbose=False)
        logger.info("✅ Model warmed up")
        
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        model_loaded = False
        raise

# Load model on startup
@app.on_event("startup")
async def startup_event():
    load_model()

# Damage classes mapping
DAMAGE_CLASSES = {
    0: "broken_glass",
    1: "broken_light",
    2: "bumper_damage",
    3: "dent",
    4: "scratch",
    5: "rust",
    6: "paint_damage",
    7: "flat_tire",
    8: "tire_wear",
    9: "mirror_damage",
    10: "door_damage",
    11: "hood_damage",
    12: "trunk_damage",
    13: "wheel_damage"
}

# Pydantic models
class DetectionRequest(BaseModel):
    image: str = Field(..., description="Base64 encoded image")
    confidence_threshold: Optional[float] = Field(
        CONFIDENCE_THRESHOLD,
        ge=0.0,
        le=1.0,
        description="Confidence threshold for detections"
    )
    iou_threshold: Optional[float] = Field(
        IOU_THRESHOLD,
        ge=0.0,
        le=1.0,
        description="IOU threshold for NMS"
    )

class Detection(BaseModel):
    label: str
    confidence: float
    bbox: List[float]  # [x, y, width, height]
    class_id: int

class DetectionResponse(BaseModel):
    success: bool
    detections: List[Detection]
    processing_time_ms: float
    image_size: List[int]  # [width, height]
    model_version: str

class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None

# Routes
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "YOLOv8 Car Damage Detector",
        "version": "1.0.0",
        "status": "ok" if model_loaded else "model_not_loaded",
        "endpoints": {
            "health": "/health",
            "detect": "/detect (POST)",
            "detect_file": "/detect/file (POST)",
            "model_info": "/model/info"
        }
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy" if model_loaded else "unhealthy",
        "model_loaded": model_loaded,
        "model_path": MODEL_PATH,
        "confidence_threshold": CONFIDENCE_THRESHOLD
    }

@app.get("/model/info")
async def model_info():
    """Get model information"""
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        return {
            "model_path": MODEL_PATH,
            "model_type": "YOLOv8",
            "classes": DAMAGE_CLASSES,
            "num_classes": len(DAMAGE_CLASSES),
            "confidence_threshold": CONFIDENCE_THRESHOLD,
            "iou_threshold": IOU_THRESHOLD
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect", response_model=DetectionResponse)
async def detect(request: DetectionRequest):
    """
    Detect damages in base64 encoded image
    
    Args:
        request: DetectionRequest with base64 image
        
    Returns:
        DetectionResponse with detected damages
    """
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    start_time = time.time()
    
    try:
        # Decode base64 image
        logger.info("Decoding base64 image...")
        image_data = base64.b64decode(request.image)
        image = Image.open(BytesIO(image_data))
        image_np = np.array(image)
        
        # Convert RGB to BGR for OpenCV
        if len(image_np.shape) == 3 and image_np.shape[2] == 3:
            image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        elif len(image_np.shape) == 2:
            # Grayscale to BGR
            image_np = cv2.cvtColor(image_np, cv2.COLOR_GRAY2BGR)
        
        image_size = [image_np.shape[1], image_np.shape[0]]  # [width, height]
        logger.info(f"Processing image: {image_size[0]}x{image_size[1]}")
        
        # Run inference
        results = model(
            image_np,
            conf=request.confidence_threshold,
            iou=request.iou_threshold,
            max_det=MAX_DETECTIONS,
            verbose=False
        )
        
        # Parse results
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                # Get box coordinates (xyxy format)
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                w = x2 - x1
                h = y2 - y1
                
                # Get class and confidence
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                
                # Map class to label
                label = DAMAGE_CLASSES.get(cls, f"unknown_{cls}")
                
                detections.append(Detection(
                    label=label,
                    confidence=round(conf, 4),
                    bbox=[round(x1, 2), round(y1, 2), round(w, 2), round(h, 2)],
                    class_id=cls
                ))
        
        processing_time = (time.time() - start_time) * 1000  # Convert to ms
        
        logger.info(f"✅ Detected {len(detections)} damages in {processing_time:.2f}ms")
        
        return DetectionResponse(
            success=True,
            detections=detections,
            processing_time_ms=round(processing_time, 2),
            image_size=image_size,
            model_version=MODEL_PATH
        )
        
    except Exception as e:
        logger.error(f"❌ Detection error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Detection failed: {str(e)}"
        )

@app.post("/detect/file", response_model=DetectionResponse)
async def detect_file(
    file: UploadFile = File(...),
    confidence_threshold: float = CONFIDENCE_THRESHOLD,
    iou_threshold: float = IOU_THRESHOLD
):
    """
    Detect damages in uploaded image file
    
    Args:
        file: Uploaded image file
        confidence_threshold: Confidence threshold
        iou_threshold: IOU threshold
        
    Returns:
        DetectionResponse with detected damages
    """
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    start_time = time.time()
    
    try:
        # Read file
        logger.info(f"Reading uploaded file: {file.filename}")
        contents = await file.read()
        
        # Convert to base64 and use detect endpoint
        base64_image = base64.b64encode(contents).decode('utf-8')
        
        request = DetectionRequest(
            image=base64_image,
            confidence_threshold=confidence_threshold,
            iou_threshold=iou_threshold
        )
        
        return await detect(request)
        
    except Exception as e:
        logger.error(f"❌ File detection error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"File detection failed: {str(e)}"
        )

@app.post("/reload")
async def reload_model():
    """Reload model (admin endpoint)"""
    try:
        logger.info("Reloading model...")
        load_model()
        return {
            "success": True,
            "message": "Model reloaded successfully",
            "model_loaded": model_loaded
        }
    except Exception as e:
        logger.error(f"❌ Model reload failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Model reload failed: {str(e)}"
        )

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return ErrorResponse(
        error=exc.detail,
        detail=str(exc)
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return ErrorResponse(
        error="Internal server error",
        detail=str(exc)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8080,
        log_level="info"
    )
