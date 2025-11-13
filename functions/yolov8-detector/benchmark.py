"""
Model Benchmark Script

Compara performance de diferentes modelos YOLOv8
Testa velocidade, precisão e uso de recursos

@author Torq AI Team
@version 1.0.0
"""

import os
import time
import psutil
import numpy as np
from pathlib import Path
from ultralytics import YOLO
import cv2
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import json


class ModelBenchmark:
    """Benchmark suite for YOLOv8 models"""
    
    def __init__(self, model_path, test_images_dir):
        self.model_path = Path(model_path)
        self.test_images_dir = Path(test_images_dir)
        self.model = None
        self.results = []
        
    def load_model(self):
        """Load model for benchmarking"""
        print(f"📥 Loading model: {self.model_path}")
        
        if not self.model_path.exists():
            raise FileNotFoundError(f"Model not found: {self.model_path}")
        
        self.model = YOLO(str(self.model_path))
        print(f"✅ Model loaded: {self.model_path.name}")
        
    def get_test_images(self, limit=100):
        """Get test images"""
        if not self.test_images_dir.exists():
            print(f"⚠️  Test directory not found: {self.test_images_dir}")
            return []
        
        images = list(self.test_images_dir.glob('*.jpg')) + \
                list(self.test_images_dir.glob('*.png'))
        
        images = images[:limit]
        print(f"📸 Found {len(images)} test images")
        
        return images
    
    def benchmark_inference_speed(self, num_runs=100, warmup=10):
        """Benchmark inference speed"""
        print("\n" + "=" * 60)
        print("⚡ Benchmarking Inference Speed")
        print("=" * 60)
        
        # Create dummy image
        dummy_img = np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8)
        
        # Warmup
        print(f"Warming up ({warmup} runs)...")
        for _ in range(warmup):
            self.model(dummy_img, verbose=False)
        
        # Benchmark
        print(f"Benchmarking ({num_runs} runs)...")
        times = []
        
        for i in range(num_runs):
            start_time = time.time()
            self.model(dummy_img, verbose=False)
            end_time = time.time()
            times.append((end_time - start_time) * 1000)  # ms
            
            if (i + 1) % 20 == 0:
                print(f"  Progress: {i + 1}/{num_runs}")
        
        # Statistics
        stats = {
            'mean_ms': np.mean(times),
            'std_ms': np.std(times),
            'min_ms': np.min(times),
            'max_ms': np.max(times),
            'p50_ms': np.percentile(times, 50),
            'p95_ms': np.percentile(times, 95),
            'p99_ms': np.percentile(times, 99),
            'fps': 1000 / np.mean(times)
        }
        
        print(f"\n📊 Speed Statistics:")
        print(f"  Mean: {stats['mean_ms']:.2f}ms")
        print(f"  Std: {stats['std_ms']:.2f}ms")
        print(f"  Min: {stats['min_ms']:.2f}ms")
        print(f"  Max: {stats['max_ms']:.2f}ms")
        print(f"  P95: {stats['p95_ms']:.2f}ms")
        print(f"  P99: {stats['p99_ms']:.2f}ms")
        print(f"  FPS: {stats['fps']:.1f}")
        
        return stats, times
    
    def benchmark_accuracy(self, test_images):
        """Benchmark accuracy on test images"""
        print("\n" + "=" * 60)
        print("🎯 Benchmarking Accuracy")
        print("=" * 60)
        
        if not test_images:
            print("⚠️  No test images available")
            return None
        
        results_list = []
        
        print(f"Testing on {len(test_images)} images...")
        
        for i, img_path in enumerate(test_images):
            try:
                # Run inference
                results = self.model(str(img_path), verbose=False)
                
                # Extract metrics
                detections = len(results[0].boxes) if results[0].boxes is not None else 0
                
                if detections > 0:
                    confidences = results[0].boxes.conf.cpu().numpy()
                    classes = results[0].boxes.cls.cpu().numpy()
                    
                    results_list.append({
                        'image': img_path.name,
                        'detections': detections,
                        'avg_confidence': np.mean(confidences),
                        'max_confidence': np.max(confidences),
                        'min_confidence': np.min(confidences),
                        'classes': len(np.unique(classes))
                    })
                else:
                    results_list.append({
                        'image': img_path.name,
                        'detections': 0,
                        'avg_confidence': 0,
                        'max_confidence': 0,
                        'min_confidence': 0,
                        'classes': 0
                    })
                
                if (i + 1) % 20 == 0:
                    print(f"  Progress: {i + 1}/{len(test_images)}")
            
            except Exception as e:
                print(f"⚠️  Error processing {img_path.name}: {e}")
        
        # Calculate statistics
        df = pd.DataFrame(results_list)
        
        stats = {
            'total_images': len(df),
            'images_with_detections': (df['detections'] > 0).sum(),
            'detection_rate': (df['detections'] > 0).sum() / len(df) * 100,
            'avg_detections_per_image': df['detections'].mean(),
            'avg_confidence': df['avg_confidence'].mean(),
            'avg_confidence_when_detected': df[df['detections'] > 0]['avg_confidence'].mean() if (df['detections'] > 0).any() else 0
        }
        
        print(f"\n📊 Accuracy Statistics:")
        print(f"  Total images: {stats['total_images']}")
        print(f"  Images with detections: {stats['images_with_detections']}")
        print(f"  Detection rate: {stats['detection_rate']:.1f}%")
        print(f"  Avg detections/image: {stats['avg_detections_per_image']:.2f}")
        print(f"  Avg confidence: {stats['avg_confidence']:.3f}")
        print(f"  Avg confidence (when detected): {stats['avg_confidence_when_detected']:.3f}")
        
        return stats, df
    
    def benchmark_resource_usage(self, duration=60):
        """Benchmark CPU and memory usage"""
        print("\n" + "=" * 60)
        print("💻 Benchmarking Resource Usage")
        print("=" * 60)
        
        # Create dummy image
        dummy_img = np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8)
        
        # Get process
        process = psutil.Process()
        
        # Baseline
        baseline_cpu = process.cpu_percent(interval=1)
        baseline_memory = process.memory_info().rss / (1024 * 1024)  # MB
        
        print(f"Baseline CPU: {baseline_cpu:.1f}%")
        print(f"Baseline Memory: {baseline_memory:.1f} MB")
        
        # Monitor during inference
        print(f"\nMonitoring for {duration} seconds...")
        
        cpu_samples = []
        memory_samples = []
        
        start_time = time.time()
        
        while time.time() - start_time < duration:
            # Run inference
            self.model(dummy_img, verbose=False)
            
            # Sample resources
            cpu_samples.append(process.cpu_percent())
            memory_samples.append(process.memory_info().rss / (1024 * 1024))
            
            time.sleep(0.1)
        
        # Statistics
        stats = {
            'baseline_cpu': baseline_cpu,
            'baseline_memory_mb': baseline_memory,
            'avg_cpu': np.mean(cpu_samples),
            'max_cpu': np.max(cpu_samples),
            'avg_memory_mb': np.mean(memory_samples),
            'max_memory_mb': np.max(memory_samples),
            'memory_increase_mb': np.mean(memory_samples) - baseline_memory
        }
        
        print(f"\n📊 Resource Statistics:")
        print(f"  Avg CPU: {stats['avg_cpu']:.1f}%")
        print(f"  Max CPU: {stats['max_cpu']:.1f}%")
        print(f"  Avg Memory: {stats['avg_memory_mb']:.1f} MB")
        print(f"  Max Memory: {stats['max_memory_mb']:.1f} MB")
        print(f"  Memory Increase: {stats['memory_increase_mb']:.1f} MB")
        
        return stats
    
    def plot_results(self, speed_times, accuracy_df, output_dir):
        """Plot benchmark results"""
        print("\n📈 Generating plots...")
        
        output_dir = Path(output_dir)
        output_dir.mkdir(exist_ok=True)
        
        # Speed distribution
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # Inference time histogram
        axes[0, 0].hist(speed_times, bins=50, color='#3498db', alpha=0.7, edgecolor='black')
        axes[0, 0].axvline(np.mean(speed_times), color='red', linestyle='--', 
                          label=f'Mean: {np.mean(speed_times):.2f}ms')
        axes[0, 0].set_title('Inference Time Distribution', fontsize=14, fontweight='bold')
        axes[0, 0].set_xlabel('Time (ms)')
        axes[0, 0].set_ylabel('Frequency')
        axes[0, 0].legend()
        axes[0, 0].grid(alpha=0.3)
        
        # Confidence distribution
        if accuracy_df is not None and len(accuracy_df) > 0:
            detected = accuracy_df[accuracy_df['detections'] > 0]
            if len(detected) > 0:
                axes[0, 1].hist(detected['avg_confidence'], bins=30, 
                              color='#2ecc71', alpha=0.7, edgecolor='black')
                axes[0, 1].set_title('Confidence Distribution', fontsize=14, fontweight='bold')
                axes[0, 1].set_xlabel('Confidence')
                axes[0, 1].set_ylabel('Frequency')
                axes[0, 1].grid(alpha=0.3)
            
            # Detections per image
            axes[1, 0].hist(accuracy_df['detections'], bins=range(0, int(accuracy_df['detections'].max()) + 2),
                          color='#9b59b6', alpha=0.7, edgecolor='black')
            axes[1, 0].set_title('Detections per Image', fontsize=14, fontweight='bold')
            axes[1, 0].set_xlabel('Number of Detections')
            axes[1, 0].set_ylabel('Frequency')
            axes[1, 0].grid(alpha=0.3)
            
            # Detection rate pie chart
            detected_count = (accuracy_df['detections'] > 0).sum()
            no_detection_count = (accuracy_df['detections'] == 0).sum()
            
            axes[1, 1].pie([detected_count, no_detection_count],
                          labels=['With Detections', 'No Detections'],
                          colors=['#2ecc71', '#e74c3c'],
                          autopct='%1.1f%%',
                          startangle=90)
            axes[1, 1].set_title('Detection Rate', fontsize=14, fontweight='bold')
        
        plt.tight_layout()
        plt.savefig(output_dir / 'benchmark_results.png', dpi=300, bbox_inches='tight')
        print(f"✅ Plots saved: {output_dir / 'benchmark_results.png'}")
    
    def generate_report(self, speed_stats, accuracy_stats, resource_stats, output_dir):
        """Generate comprehensive benchmark report"""
        print("\n📄 Generating report...")
        
        output_dir = Path(output_dir)
        report_path = output_dir / 'benchmark_report.md'
        
        with open(report_path, 'w') as f:
            f.write("# YOLOv8 Model Benchmark Report\n\n")
            f.write(f"**Model**: {self.model_path.name}\n")
            f.write(f"**Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            # Speed metrics
            f.write("## ⚡ Speed Performance\n\n")
            f.write("| Metric | Value |\n")
            f.write("|--------|-------|\n")
            f.write(f"| Mean Inference Time | {speed_stats['mean_ms']:.2f}ms |\n")
            f.write(f"| Standard Deviation | {speed_stats['std_ms']:.2f}ms |\n")
            f.write(f"| Min Time | {speed_stats['min_ms']:.2f}ms |\n")
            f.write(f"| Max Time | {speed_stats['max_ms']:.2f}ms |\n")
            f.write(f"| P95 | {speed_stats['p95_ms']:.2f}ms |\n")
            f.write(f"| P99 | {speed_stats['p99_ms']:.2f}ms |\n")
            f.write(f"| Estimated FPS | {speed_stats['fps']:.1f} |\n\n")
            
            # Performance rating
            if speed_stats['mean_ms'] < 50:
                rating = "🚀 Excellent - Real-time capable"
            elif speed_stats['mean_ms'] < 100:
                rating = "✅ Good - Near real-time"
            elif speed_stats['mean_ms'] < 250:
                rating = "🟡 Acceptable - Batch processing"
            else:
                rating = "🔴 Slow - Optimization needed"
            
            f.write(f"**Performance Rating**: {rating}\n\n")
            
            # Accuracy metrics
            if accuracy_stats:
                f.write("## 🎯 Accuracy Performance\n\n")
                f.write("| Metric | Value |\n")
                f.write("|--------|-------|\n")
                f.write(f"| Total Images | {accuracy_stats['total_images']} |\n")
                f.write(f"| Images with Detections | {accuracy_stats['images_with_detections']} |\n")
                f.write(f"| Detection Rate | {accuracy_stats['detection_rate']:.1f}% |\n")
                f.write(f"| Avg Detections/Image | {accuracy_stats['avg_detections_per_image']:.2f} |\n")
                f.write(f"| Avg Confidence | {accuracy_stats['avg_confidence']:.3f} |\n")
                f.write(f"| Avg Confidence (detected) | {accuracy_stats['avg_confidence_when_detected']:.3f} |\n\n")
            
            # Resource usage
            if resource_stats:
                f.write("## 💻 Resource Usage\n\n")
                f.write("| Metric | Value |\n")
                f.write("|--------|-------|\n")
                f.write(f"| Avg CPU | {resource_stats['avg_cpu']:.1f}% |\n")
                f.write(f"| Max CPU | {resource_stats['max_cpu']:.1f}% |\n")
                f.write(f"| Avg Memory | {resource_stats['avg_memory_mb']:.1f} MB |\n")
                f.write(f"| Max Memory | {resource_stats['max_memory_mb']:.1f} MB |\n")
                f.write(f"| Memory Increase | {resource_stats['memory_increase_mb']:.1f} MB |\n\n")
            
            # Recommendations
            f.write("## 💡 Recommendations\n\n")
            
            if speed_stats['mean_ms'] > 100:
                f.write("### Speed Optimization\n")
                f.write("- Consider using a smaller model (YOLOv8n)\n")
                f.write("- Export to ONNX or TensorRT for faster inference\n")
                f.write("- Use GPU acceleration if available\n")
                f.write("- Implement batch processing\n\n")
            
            if accuracy_stats and accuracy_stats['detection_rate'] < 80:
                f.write("### Accuracy Improvement\n")
                f.write("- Collect more training data\n")
                f.write("- Increase data augmentation\n")
                f.write("- Use a larger model for better accuracy\n")
                f.write("- Fine-tune confidence threshold\n\n")
            
            if resource_stats and resource_stats['max_memory_mb'] > 2000:
                f.write("### Memory Optimization\n")
                f.write("- Use smaller batch sizes\n")
                f.write("- Reduce input image size\n")
                f.write("- Clear cache between inferences\n\n")
        
        print(f"✅ Report saved: {report_path}")
        
        # Save JSON results
        json_path = output_dir / 'benchmark_results.json'
        results = {
            'model': str(self.model_path),
            'timestamp': datetime.now().isoformat(),
            'speed': speed_stats,
            'accuracy': accuracy_stats,
            'resources': resource_stats
        }
        
        with open(json_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"✅ JSON results saved: {json_path}")
    
    def run_full_benchmark(self, output_dir='benchmark_results'):
        """Run complete benchmark suite"""
        print("\n" + "=" * 80)
        print("🚀 Starting Full Benchmark Suite")
        print("=" * 80)
        
        # Load model
        self.load_model()
        
        # Get test images
        test_images = self.get_test_images(limit=100)
        
        # Run benchmarks
        speed_stats, speed_times = self.benchmark_inference_speed(num_runs=100)
        accuracy_stats, accuracy_df = self.benchmark_accuracy(test_images)
        resource_stats = self.benchmark_resource_usage(duration=30)
        
        # Generate outputs
        output_dir = Path(output_dir)
        output_dir.mkdir(exist_ok=True)
        
        self.plot_results(speed_times, accuracy_df, output_dir)
        self.generate_report(speed_stats, accuracy_stats, resource_stats, output_dir)
        
        print("\n" + "=" * 80)
        print("✅ Benchmark Complete!")
        print("=" * 80)
        print(f"\nResults saved in: {output_dir}")
        print("\nKey files:")
        print("  📊 benchmark_results.png - Visual results")
        print("  📄 benchmark_report.md - Detailed report")
        print("  📋 benchmark_results.json - Raw data")


def main():
    """Main benchmark execution"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Benchmark YOLOv8 model')
    parser.add_argument('--model', type=str, 
                       default='runs/train/car_damage_detector/weights/best.pt',
                       help='Path to model')
    parser.add_argument('--test-images', type=str,
                       default='datasets/car-damage/images/test',
                       help='Path to test images')
    parser.add_argument('--output', type=str, default='benchmark_results',
                       help='Output directory')
    
    args = parser.parse_args()
    
    # Run benchmark
    benchmark = ModelBenchmark(args.model, args.test_images)
    benchmark.run_full_benchmark(args.output)


if __name__ == '__main__':
    main()
