/**
 * Cloud Function: processVehicleImage
 * 
 * Triggered when a new image is uploaded to Storage bucket 'vehicle-diagnostics/'
 * Processes the image using YOLOv8 detector and saves results to Firestore
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const sharp = require('sharp');
const { Storage } = require('@google-cloud/storage');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const storage = new Storage();

// Configuration
const CONFIG = {
  CLOUD_RUN_URL: process.env.YOLOV8_DETECTOR_URL || 'https://yolov8-detector-xxxxx.run.app',
  CONFIDENCE_THRESHOLD: 0.45,
  MAX_PROCESSING_TIME: 30000, // 30 seconds
  BUCKET_NAME: 'vehicle-diagnostics',
};

/**
 * Main function triggered on Storage upload
 */
exports.processVehicleImage = functions.storage
  .object()
  .onFinalize(async (object) => {
    const filePath = object.name;
    const contentType = object.contentType;

    // Only process images in vehicle-diagnostics folder
    if (!filePath.startsWith('vehicle-diagnostics/')) {
      console.log('Ignoring file outside vehicle-diagnostics folder');
      return null;
    }

    // Only process image files
    if (!contentType || !contentType.startsWith('image/')) {
      console.log('Ignoring non-image file');
      return null;
    }

    // Extract metadata from file path
    // Format: vehicle-diagnostics/{empresaId}/{diagnosisId}/{imageId}.jpg
    const pathParts = filePath.split('/');
    if (pathParts.length !== 4) {
      console.error('Invalid file path format');
      return null;
    }

    const [, empresaId, diagnosisId, imageFileName] = pathParts;

    console.log(`Processing image: ${filePath}`);
    console.log(`Diagnosis ID: ${diagnosisId}`);

    try {
      // 1. Get diagnosis document
      const diagnosisRef = db.collection('diagnostics').doc(diagnosisId);
      const diagnosisDoc = await diagnosisRef.get();

      if (!diagnosisDoc.exists) {
        throw new Error(`Diagnosis ${diagnosisId} not found`);
      }

      // 2. Update status to processing
      await diagnosisRef.update({
        status: 'processing',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 3. Download image from Storage
      const bucket = storage.bucket(object.bucket);
      const file = bucket.file(filePath);
      const [imageBuffer] = await file.download();

      // 4. Call YOLOv8 detector
      console.log('Calling YOLOv8 detector...');
      const detections = await detectDamages(imageBuffer);

      // 5. Generate annotated image
      console.log('Generating annotated image...');
      const annotatedImageBuffer = await generateAnnotatedImage(
        imageBuffer,
        detections
      );

      // 6. Upload annotated image
      const annotatedFileName = imageFileName.replace('.', '_annotated.');
      const annotatedFilePath = `vehicle-diagnostics/${empresaId}/${diagnosisId}/${annotatedFileName}`;
      const annotatedFile = bucket.file(annotatedFilePath);

      await annotatedFile.save(annotatedImageBuffer, {
        contentType: 'image/jpeg',
        metadata: {
          metadata: {
            diagnosisId,
            type: 'annotated',
          },
        },
      });

      // 7. Get public URLs
      const [originalUrl] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      const [annotatedUrl] = await annotatedFile.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      // 8. Process detections and calculate summary
      const summary = calculateSummary(detections);

      // 9. Update Firestore with results
      const imageData = {
        original: originalUrl,
        annotated: annotatedUrl,
        detections: detections.map((d) => ({
          label: d.label,
          confidence: d.confidence,
          bbox: d.bbox,
          severity: calculateSeverity(d),
        })),
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await diagnosisRef.update({
        images: admin.firestore.FieldValue.arrayUnion(imageData),
        summary,
        status: 'completed',
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('Image processed successfully');
      return { success: true, diagnosisId };
    } catch (error) {
      console.error('Error processing image:', error);

      // Update diagnosis with error
      await db.collection('diagnostics').doc(diagnosisId).update({
        status: 'failed',
        error: error.message,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      throw error;
    }
  });

/**
 * Call YOLOv8 detector API
 */
async function detectDamages(imageBuffer) {
  try {
    const response = await axios.post(
      `${CONFIG.CLOUD_RUN_URL}/detect`,
      {
        image: imageBuffer.toString('base64'),
        confidence_threshold: CONFIG.CONFIDENCE_THRESHOLD,
      },
      {
        timeout: CONFIG.MAX_PROCESSING_TIME,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.detections || [];
  } catch (error) {
    console.error('Error calling YOLOv8 detector:', error);
    throw new Error('Failed to detect damages');
  }
}

/**
 * Generate annotated image with bounding boxes
 */
async function generateAnnotatedImage(imageBuffer, detections) {
  try {
    // Load image with sharp
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    // Create SVG overlay with bounding boxes
    const svgOverlay = generateSVGOverlay(detections, metadata.width, metadata.height);

    // Composite SVG on top of image
    const annotatedImage = await image
      .composite([
        {
          input: Buffer.from(svgOverlay),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    return annotatedImage;
  } catch (error) {
    console.error('Error generating annotated image:', error);
    throw new Error('Failed to generate annotated image');
  }
}

/**
 * Generate SVG overlay with bounding boxes and labels
 */
function generateSVGOverlay(detections, width, height) {
  const boxes = detections
    .map((detection) => {
      const [x, y, w, h] = detection.bbox;
      const color = getSeverityColor(calculateSeverity(detection));

      return `
        <rect
          x="${x}"
          y="${y}"
          width="${w}"
          height="${h}"
          fill="none"
          stroke="${color}"
          stroke-width="3"
        />
        <text
          x="${x}"
          y="${y - 5}"
          font-family="Arial"
          font-size="16"
          font-weight="bold"
          fill="${color}"
        >
          ${detection.label} (${(detection.confidence * 100).toFixed(0)}%)
        </text>
      `;
    })
    .join('');

  return `
    <svg width="${width}" height="${height}">
      ${boxes}
    </svg>
  `;
}

/**
 * Calculate severity based on detection type and confidence
 */
function calculateSeverity(detection) {
  const { label, confidence } = detection;

  // High severity damages
  const highSeverityLabels = ['broken_glass', 'broken_light', 'bumper_damage'];
  if (highSeverityLabels.includes(label) && confidence > 0.7) {
    return 'high';
  }

  // Medium severity damages
  const mediumSeverityLabels = ['dent', 'rust', 'paint_damage'];
  if (mediumSeverityLabels.includes(label) && confidence > 0.6) {
    return 'medium';
  }

  // Low severity
  return 'low';
}

/**
 * Get color for severity level
 */
function getSeverityColor(severity) {
  const colors = {
    high: '#ef4444', // red-500
    medium: '#f59e0b', // amber-500
    low: '#10b981', // green-500
  };
  return colors[severity] || colors.low;
}

/**
 * Calculate summary statistics
 */
function calculateSummary(detections) {
  const totalDamages = detections.length;
  const needsHumanReview = detections.some((d) => d.confidence < 0.5);

  // Count by severity
  const severityCounts = detections.reduce(
    (acc, d) => {
      const severity = calculateSeverity(d);
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  // Estimate cost (placeholder - should be based on historical data)
  const estimatedCost = detections.reduce((total, d) => {
    const baseCosts = {
      broken_glass: 500,
      broken_light: 300,
      bumper_damage: 800,
      dent: 200,
      scratch: 150,
      rust: 250,
      paint_damage: 400,
      flat_tire: 300,
    };
    return total + (baseCosts[d.label] || 100);
  }, 0);

  // Suggest services based on damages
  const suggestedServices = [...new Set(detections.map((d) => mapDamageToService(d.label)))];

  return {
    totalDamages,
    needsHumanReview,
    severityCounts,
    estimatedCost,
    suggestedServices,
  };
}

/**
 * Map damage type to service ID
 */
function mapDamageToService(damageLabel) {
  const mapping = {
    broken_glass: 'glass_replacement',
    broken_light: 'light_replacement',
    bumper_damage: 'bumper_repair',
    dent: 'dent_removal',
    scratch: 'paint_touch_up',
    rust: 'rust_treatment',
    paint_damage: 'paint_repair',
    flat_tire: 'tire_replacement',
  };
  return mapping[damageLabel] || 'general_repair';
}
