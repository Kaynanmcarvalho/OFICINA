"""
Test script for YOLOv8 Car Damage Detector

Usage:
    python test_detector.py --image sample_car.jpg --url http://localhost:8080
"""

import requests
import base64
import argparse
import json
from pathlib import Path
import time

def test_health(base_url):
    """Test health endpoint"""
    print("\n🏥 Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        response.raise_for_status()
        data = response.json()
        
        print(f"✅ Health check passed")
        print(f"   Status: {data['status']}")
        print(f"   Model loaded: {data['model_loaded']}")
        print(f"   Model path: {data['model_path']}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_model_info(base_url):
    """Test model info endpoint"""
    print("\n📊 Testing model info endpoint...")
    try:
        response = requests.get(f"{base_url}/model/info", timeout=10)
        response.raise_for_status()
        data = response.json()
        
        print(f"✅ Model info retrieved")
        print(f"   Model type: {data['model_type']}")
        print(f"   Number of classes: {data['num_classes']}")
        print(f"   Confidence threshold: {data['confidence_threshold']}")
        print(f"   Classes: {list(data['classes'].values())[:5]}...")
        return True
    except Exception as e:
        print(f"❌ Model info failed: {e}")
        return False

def test_detection_base64(base_url, image_path, confidence=0.45):
    """Test detection with base64 encoded image"""
    print(f"\n🔍 Testing detection with {image_path}...")
    
    try:
        # Read and encode image
        with open(image_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        print(f"   Image size: {len(image_data)} bytes (base64)")
        
        # Call API
        start_time = time.time()
        response = requests.post(
            f"{base_url}/detect",
            json={
                'image': image_data,
                'confidence_threshold': confidence
            },
            timeout=60
        )
        response.raise_for_status()
        elapsed = (time.time() - start_time) * 1000
        
        data = response.json()
        
        print(f"✅ Detection completed in {elapsed:.2f}ms")
        print(f"   Server processing time: {data['processing_time_ms']:.2f}ms")
        print(f"   Image size: {data['image_size'][0]}x{data['image_size'][1]}")
        print(f"   Detections: {len(data['detections'])}")
        
        if data['detections']:
            print(f"\n   📋 Detected damages:")
            for i, det in enumerate(data['detections'], 1):
                print(f"      {i}. {det['label']}: {det['confidence']:.2%} confidence")
                print(f"         BBox: [{det['bbox'][0]:.1f}, {det['bbox'][1]:.1f}, {det['bbox'][2]:.1f}, {det['bbox'][3]:.1f}]")
        else:
            print(f"   ℹ️  No damages detected (confidence threshold: {confidence})")
        
        return True, data
    except Exception as e:
        print(f"❌ Detection failed: {e}")
        return False, None

def test_detection_file(base_url, image_path, confidence=0.45):
    """Test detection with file upload"""
    print(f"\n📤 Testing file upload detection with {image_path}...")
    
    try:
        # Prepare file
        with open(image_path, 'rb') as f:
            files = {'file': (Path(image_path).name, f, 'image/jpeg')}
            data = {'confidence_threshold': confidence}
            
            # Call API
            start_time = time.time()
            response = requests.post(
                f"{base_url}/detect/file",
                files=files,
                data=data,
                timeout=60
            )
            response.raise_for_status()
            elapsed = (time.time() - start_time) * 1000
        
        result = response.json()
        
        print(f"✅ File upload detection completed in {elapsed:.2f}ms")
        print(f"   Detections: {len(result['detections'])}")
        
        return True, result
    except Exception as e:
        print(f"❌ File upload detection failed: {e}")
        return False, None

def test_performance(base_url, image_path, iterations=10):
    """Test performance with multiple requests"""
    print(f"\n⚡ Testing performance ({iterations} iterations)...")
    
    try:
        # Read and encode image once
        with open(image_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        times = []
        for i in range(iterations):
            start_time = time.time()
            response = requests.post(
                f"{base_url}/detect",
                json={
                    'image': image_data,
                    'confidence_threshold': 0.45
                },
                timeout=60
            )
            response.raise_for_status()
            elapsed = (time.time() - start_time) * 1000
            times.append(elapsed)
            
            print(f"   Iteration {i+1}/{iterations}: {elapsed:.2f}ms")
        
        avg_time = sum(times) / len(times)
        min_time = min(times)
        max_time = max(times)
        
        print(f"\n✅ Performance test completed")
        print(f"   Average: {avg_time:.2f}ms")
        print(f"   Min: {min_time:.2f}ms")
        print(f"   Max: {max_time:.2f}ms")
        
        return True
    except Exception as e:
        print(f"❌ Performance test failed: {e}")
        return False

def save_results(results, output_path):
    """Save detection results to JSON file"""
    try:
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\n💾 Results saved to {output_path}")
        return True
    except Exception as e:
        print(f"❌ Failed to save results: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Test YOLOv8 Car Damage Detector')
    parser.add_argument('--url', default='http://localhost:8080', help='Detector API URL')
    parser.add_argument('--image', required=True, help='Path to test image')
    parser.add_argument('--confidence', type=float, default=0.45, help='Confidence threshold')
    parser.add_argument('--performance', action='store_true', help='Run performance test')
    parser.add_argument('--iterations', type=int, default=10, help='Performance test iterations')
    parser.add_argument('--output', help='Output JSON file for results')
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("🤖 YOLOv8 Car Damage Detector - Test Suite")
    print("=" * 60)
    print(f"API URL: {args.url}")
    print(f"Test image: {args.image}")
    print(f"Confidence threshold: {args.confidence}")
    
    # Check if image exists
    if not Path(args.image).exists():
        print(f"\n❌ Error: Image file not found: {args.image}")
        return
    
    # Run tests
    results = {}
    
    # 1. Health check
    health_ok = test_health(args.url)
    if not health_ok:
        print("\n❌ Health check failed. Is the server running?")
        return
    
    # 2. Model info
    model_info_ok = test_model_info(args.url)
    
    # 3. Detection (base64)
    detection_ok, detection_results = test_detection_base64(
        args.url,
        args.image,
        args.confidence
    )
    if detection_ok:
        results['base64_detection'] = detection_results
    
    # 4. Detection (file upload)
    file_ok, file_results = test_detection_file(
        args.url,
        args.image,
        args.confidence
    )
    if file_ok:
        results['file_detection'] = file_results
    
    # 5. Performance test (optional)
    if args.performance:
        perf_ok = test_performance(
            args.url,
            args.image,
            args.iterations
        )
    
    # Save results
    if args.output and results:
        save_results(results, args.output)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    print(f"✅ Health check: {'PASS' if health_ok else 'FAIL'}")
    print(f"✅ Model info: {'PASS' if model_info_ok else 'FAIL'}")
    print(f"✅ Base64 detection: {'PASS' if detection_ok else 'FAIL'}")
    print(f"✅ File detection: {'PASS' if file_ok else 'FAIL'}")
    if args.performance:
        print(f"✅ Performance test: {'PASS' if perf_ok else 'FAIL'}")
    
    all_passed = health_ok and model_info_ok and detection_ok and file_ok
    if args.performance:
        all_passed = all_passed and perf_ok
    
    if all_passed:
        print("\n🎉 All tests passed!")
    else:
        print("\n⚠️  Some tests failed")
    
    print("=" * 60)

if __name__ == '__main__':
    main()
