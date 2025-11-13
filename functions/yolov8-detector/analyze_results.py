"""
Training Results Analysis Script

Analisa resultados do treinamento YOLOv8
Gera relatórios detalhados, gráficos e recomendações

@author Torq AI Team
@version 1.0.0
"""

import os
import time
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import numpy as np
from ultralytics import YOLO
import cv2
import json
from datetime import datetime
import argparse

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (15, 10)


def load_training_results(results_dir):
    """Load training results from CSV"""
    results_path = results_dir / 'results.csv'
    
    if not results_path.exists():
        print(f"❌ Results file not found: {results_path}")
        return None
    
    df = pd.read_csv(results_path)
    df.columns = df.columns.str.strip()  # Remove whitespace
    
    print(f"✅ Loaded training results: {len(df)} epochs")
    return df


def plot_training_curves(df, results_dir):
    """Plot training curves"""
    print("\n📈 Plotting training curves...")
    
    fig, axes = plt.subplots(2, 3, figsize=(18, 12))
    
    # Loss curves
    axes[0, 0].plot(df['epoch'], df['train/box_loss'], label='Train', color='#3498db', linewidth=2)
    axes[0, 0].plot(df['epoch'], df['val/box_loss'], label='Val', color='#e74c3c', linewidth=2)
    axes[0, 0].set_title('Box Loss', fontsize=14, fontweight='bold')
    axes[0, 0].set_xlabel('Epoch')
    axes[0, 0].set_ylabel('Loss')
    axes[0, 0].legend()
    axes[0, 0].grid(alpha=0.3)
    
    axes[0, 1].plot(df['epoch'], df['train/cls_loss'], label='Train', color='#3498db', linewidth=2)
    axes[0, 1].plot(df['epoch'], df['val/cls_loss'], label='Val', color='#e74c3c', linewidth=2)
    axes[0, 1].set_title('Classification Loss', fontsize=14, fontweight='bold')
    axes[0, 1].set_xlabel('Epoch')
    axes[0, 1].set_ylabel('Loss')
    axes[0, 1].legend()
    axes[0, 1].grid(alpha=0.3)
    
    axes[0, 2].plot(df['epoch'], df['train/dfl_loss'], label='Train', color='#3498db', linewidth=2)
    axes[0, 2].plot(df['epoch'], df['val/dfl_loss'], label='Val', color='#e74c3c', linewidth=2)
    axes[0, 2].set_title('DFL Loss', fontsize=14, fontweight='bold')
    axes[0, 2].set_xlabel('Epoch')
    axes[0, 2].set_ylabel('Loss')
    axes[0, 2].legend()
    axes[0, 2].grid(alpha=0.3)
    
    # Metrics
    axes[1, 0].plot(df['epoch'], df['metrics/mAP50(B)'], color='#2ecc71', linewidth=3)
    axes[1, 0].set_title('mAP@0.5', fontsize=14, fontweight='bold')
    axes[1, 0].set_xlabel('Epoch')
    axes[1, 0].set_ylabel('mAP')
    axes[1, 0].grid(alpha=0.3)
    
    axes[1, 1].plot(df['epoch'], df['metrics/mAP50-95(B)'], color='#9b59b6', linewidth=3)
    axes[1, 1].set_title('mAP@0.5:0.95', fontsize=14, fontweight='bold')
    axes[1, 1].set_xlabel('Epoch')
    axes[1, 1].set_ylabel('mAP')
    axes[1, 1].grid(alpha=0.3)
    
    # Learning rate
    axes[1, 2].plot(df['epoch'], df['lr/pg0'], color='#f39c12', linewidth=2)
    axes[1, 2].set_title('Learning Rate', fontsize=14, fontweight='bold')
    axes[1, 2].set_xlabel('Epoch')
    axes[1, 2].set_ylabel('LR')
    axes[1, 2].grid(alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(results_dir / 'training_analysis.png', dpi=300, bbox_inches='tight')
    print(f"✅ Training curves saved: training_analysis.png")


def analyze_best_metrics(df):
    """Analyze best metrics achieved"""
    print("\n" + "=" * 60)
    print("🏆 Best Metrics Achieved")
    print("=" * 60)
    
    # Find best epoch
    best_epoch = df.loc[df['metrics/mAP50(B)'].idxmax()]
    
    print(f"\nBest epoch: {int(best_epoch['epoch'])}")
    print(f"mAP@0.5: {best_epoch['metrics/mAP50(B)']:.4f}")
    print(f"mAP@0.5:0.95: {best_epoch['metrics/mAP50-95(B)']:.4f}")
    
    # Final metrics
    final_epoch = df.iloc[-1]
    print(f"\nFinal epoch: {int(final_epoch['epoch'])}")
    print(f"mAP@0.5: {final_epoch['metrics/mAP50(B)']:.4f}")
    print(f"mAP@0.5:0.95: {final_epoch['metrics/mAP50-95(B)']:.4f}")
    
    # Loss analysis
    print(f"\nFinal losses:")
    print(f"Box loss: {final_epoch['val/box_loss']:.4f}")
    print(f"Cls loss: {final_epoch['val/cls_loss']:.4f}")
    print(f"DFL loss: {final_epoch['val/dfl_loss']:.4f}")
    
    return best_epoch, final_epoch


def check_overfitting(df):
    """Check for overfitting"""
    print("\n" + "=" * 60)
    print("🔍 Overfitting Analysis")
    print("=" * 60)
    
    # Compare train vs val loss in last 20% of epochs
    last_20_percent = int(len(df) * 0.8)
    recent_df = df.iloc[last_20_percent:]
    
    train_box_loss = recent_df['train/box_loss'].mean()
    val_box_loss = recent_df['val/box_loss'].mean()
    
    train_cls_loss = recent_df['train/cls_loss'].mean()
    val_cls_loss = recent_df['val/cls_loss'].mean()
    
    box_gap = (val_box_loss - train_box_loss) / train_box_loss * 100
    cls_gap = (val_cls_loss - train_cls_loss) / train_cls_loss * 100
    
    print(f"\nLast 20% epochs analysis:")
    print(f"Box loss gap: {box_gap:.1f}% (val higher than train)")
    print(f"Cls loss gap: {cls_gap:.1f}% (val higher than train)")
    
    # Check if mAP is still improving
    recent_map = recent_df['metrics/mAP50(B)'].values
    if len(recent_map) > 5:
        trend = np.polyfit(range(len(recent_map)), recent_map, 1)[0]
        print(f"mAP trend (recent): {'📈 improving' if trend > 0 else '📉 declining'}")
    
    # Overfitting indicators
    overfitting_score = 0
    
    if box_gap > 20:
        print("⚠️  High box loss gap (>20%) - possible overfitting")
        overfitting_score += 1
    
    if cls_gap > 20:
        print("⚠️  High cls loss gap (>20%) - possible overfitting")
        overfitting_score += 1
    
    if len(recent_map) > 5 and trend < -0.001:
        print("⚠️  mAP declining in recent epochs")
        overfitting_score += 1
    
    if overfitting_score == 0:
        print("✅ No clear signs of overfitting")
    elif overfitting_score == 1:
        print("🟡 Mild overfitting detected")
    else:
        print("🔴 Strong overfitting detected")
    
    return overfitting_score


def test_model_on_samples(model_path, test_images_dir, num_samples=10):
    """Test model on sample images"""
    print("\n" + "=" * 60)
    print("🧪 Testing Model on Samples")
    print("=" * 60)
    
    if not model_path.exists():
        print(f"❌ Model not found: {model_path}")
        return None
    
    # Load model
    model = YOLO(str(model_path))
    
    # Find test images
    if test_images_dir.exists():
        test_images = list(test_images_dir.glob('*.jpg')) + list(test_images_dir.glob('*.png'))
        test_images = test_images[:num_samples]
    else:
        print(f"⚠️  Test images directory not found: {test_images_dir}")
        return None
    
    if not test_images:
        print("⚠️  No test images found")
        return None
    
    print(f"Testing on {len(test_images)} images...")
    
    results_summary = []
    
    for i, img_path in enumerate(test_images):
        try:
            # Run inference
            results = model(str(img_path), verbose=False)
            
            # Count detections
            detections = len(results[0].boxes) if results[0].boxes is not None else 0
            
            # Get confidence scores
            if detections > 0:
                confidences = results[0].boxes.conf.cpu().numpy()
                avg_conf = np.mean(confidences)
                max_conf = np.max(confidences)
            else:
                avg_conf = 0
                max_conf = 0
            
            results_summary.append({
                'image': img_path.name,
                'detections': detections,
                'avg_confidence': avg_conf,
                'max_confidence': max_conf
            })
            
            # Save annotated image (first 3 only)
            if i < 3:
                annotated = results[0].plot()
                output_path = f'test_result_{i+1}.jpg'
                cv2.imwrite(output_path, annotated)
        
        except Exception as e:
            print(f"⚠️  Error processing {img_path.name}: {e}")
    
    # Summary statistics
    if results_summary:
        df_results = pd.DataFrame(results_summary)
        
        print(f"\nTest Results Summary:")
        print(f"Average detections per image: {df_results['detections'].mean():.1f}")
        print(f"Images with detections: {(df_results['detections'] > 0).sum()}/{len(df_results)}")
        print(f"Average confidence: {df_results['avg_confidence'].mean():.3f}")
        print(f"Max confidence: {df_results['max_confidence'].max():.3f}")
        
        print(f"\n✅ Sample test results saved: test_result_1.jpg, test_result_2.jpg, test_result_3.jpg")
    
    return results_summary


def benchmark_inference_speed(model_path, num_runs=100):
    """Benchmark inference speed"""
    print("\n" + "=" * 60)
    print("⚡ Benchmarking Inference Speed")
    print("=" * 60)
    
    if not model_path.exists():
        print(f"❌ Model not found: {model_path}")
        return None
    
    # Load model
    model = YOLO(str(model_path))
    
    # Create dummy image
    dummy_img = np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8)
    
    # Warm up
    print("Warming up...")
    for _ in range(10):
        model(dummy_img, verbose=False)
    
    # Benchmark
    print(f"Benchmarking ({num_runs} runs)...")
    times = []
    
    for _ in range(num_runs):
        start_time = time.time()
        model(dummy_img, verbose=False)
        end_time = time.time()
        times.append((end_time - start_time) * 1000)  # Convert to ms
    
    # Statistics
    mean_time = np.mean(times)
    std_time = np.std(times)
    min_time = np.min(times)
    max_time = np.max(times)
    p95_time = np.percentile(times, 95)
    
    print(f"\nInference Speed ({num_runs} runs):")
    print(f"Mean: {mean_time:.2f}ms")
    print(f"Std: {std_time:.2f}ms")
    print(f"Min: {min_time:.2f}ms")
    print(f"Max: {max_time:.2f}ms")
    print(f"P95: {p95_time:.2f}ms")
    
    # FPS calculation
    fps = 1000 / mean_time
    print(f"\nEstimated FPS: {fps:.1f}")
    
    # Performance rating
    if mean_time < 50:
        rating = "🚀 Excellent (Real-time capable)"
    elif mean_time < 100:
        rating = "✅ Good (Near real-time)"
    elif mean_time < 250:
        rating = "🟡 Acceptable (Batch processing)"
    else:
        rating = "🔴 Slow (Optimization needed)"
    
    print(f"Performance: {rating}")
    
    return {
        'mean_ms': mean_time,
        'std_ms': std_time,
        'fps': fps,
        'rating': rating
    }


def generate_report(results_dir, df, best_epoch, final_epoch, overfitting_score, benchmark_results):
    """Generate comprehensive analysis report"""
    print("\n" + "=" * 60)
    print("📄 Generating Comprehensive Report")
    print("=" * 60)
    
    report_path = results_dir / 'training_analysis_report.md'
    
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# YOLOv8 Training Analysis Report\n\n")
        f.write(f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"**Model**: Car Damage Detection\n")
        f.write(f"**Total Epochs**: {len(df)}\n\n")
        
        # Executive Summary
        f.write("## 📊 Executive Summary\n\n")
        
        # Quality assessment
        map50 = best_epoch['metrics/mAP50(B)']
        if map50 >= 0.90:
            quality = "🏆 Excellent"
        elif map50 >= 0.85:
            quality = "✅ Good"
        elif map50 >= 0.75:
            quality = "🟡 Acceptable"
        else:
            quality = "🔴 Needs Improvement"
        
        f.write(f"- **Model Quality**: {quality} (mAP@0.5: {map50:.3f})\n")
        f.write(f"- **Best Epoch**: {int(best_epoch['epoch'])}\n")
        f.write(f"- **Overfitting Risk**: {'🔴 High' if overfitting_score >= 2 else '🟡 Medium' if overfitting_score == 1 else '✅ Low'}\n")
        
        if benchmark_results:
            f.write(f"- **Inference Speed**: {benchmark_results['mean_ms']:.1f}ms ({benchmark_results['fps']:.1f} FPS)\n")
        
        f.write("\n## 📈 Training Metrics\n\n")
        
        # Best metrics table
        f.write("### Best Performance\n\n")
        f.write("| Metric | Value | Epoch |\n")
        f.write("|--------|-------|-------|\n")
        f.write(f"| mAP@0.5 | {best_epoch['metrics/mAP50(B)']:.4f} | {int(best_epoch['epoch'])} |\n")
        f.write(f"| mAP@0.5:0.95 | {best_epoch['metrics/mAP50-95(B)']:.4f} | {int(best_epoch['epoch'])} |\n")
        
        # Final metrics table
        f.write("\n### Final Performance\n\n")
        f.write("| Metric | Value |\n")
        f.write("|--------|-------|\n")
        f.write(f"| mAP@0.5 | {final_epoch['metrics/mAP50(B)']:.4f} |\n")
        f.write(f"| mAP@0.5:0.95 | {final_epoch['metrics/mAP50-95(B)']:.4f} |\n")
        f.write(f"| Box Loss | {final_epoch['val/box_loss']:.4f} |\n")
        f.write(f"| Cls Loss | {final_epoch['val/cls_loss']:.4f} |\n")
        f.write(f"| DFL Loss | {final_epoch['val/dfl_loss']:.4f} |\n")
        
        # Performance benchmarks
        if benchmark_results:
            f.write("\n## ⚡ Performance Benchmarks\n\n")
            f.write("| Metric | Value |\n")
            f.write("|--------|-------|\n")
            f.write(f"| Mean Inference Time | {benchmark_results['mean_ms']:.2f}ms |\n")
            f.write(f"| Standard Deviation | {benchmark_results['std_ms']:.2f}ms |\n")
            f.write(f"| Estimated FPS | {benchmark_results['fps']:.1f} |\n")
            f.write(f"| Performance Rating | {benchmark_results['rating']} |\n")
        
        # Recommendations
        f.write("\n## 💡 Recommendations\n\n")
        
        if map50 < 0.85:
            f.write("### Accuracy Improvements\n")
            f.write("- 📊 **Collect more training data** - Current mAP is below target (0.85)\n")
            f.write("- 🔄 **Try data augmentation** - Increase diversity in training data\n")
            f.write("- 📏 **Use larger model** - Consider YOLOv8s or YOLOv8m for better accuracy\n")
            f.write("- ⏱️ **Train longer** - Increase epochs if not overfitting\n\n")
        
        if overfitting_score >= 2:
            f.write("### Overfitting Mitigation\n")
            f.write("- 🛑 **Reduce model complexity** - Use smaller model or add regularization\n")
            f.write("- 📊 **Collect more training data** - Increase dataset size\n")
            f.write("- 🔄 **Increase data augmentation** - Add more variety to training\n")
            f.write("- ⏹️ **Early stopping** - Stop training when validation loss stops improving\n\n")
        
        if benchmark_results and benchmark_results['mean_ms'] > 250:
            f.write("### Speed Optimization\n")
            f.write("- 📦 **Use smaller model** - YOLOv8n for faster inference\n")
            f.write("- 🔧 **Export to ONNX** - Optimize for production deployment\n")
            f.write("- 🖥️ **Use GPU** - Deploy on GPU-enabled infrastructure\n")
            f.write("- ⚡ **Batch processing** - Process multiple images together\n\n")
        
        # Next steps
        f.write("## 🚀 Next Steps\n\n")
        f.write("1. **Review training curves** in `training_analysis.png`\n")
        f.write("2. **Check sample predictions** in `test_result_*.jpg`\n")
        f.write("3. **Deploy model** if metrics meet requirements\n")
        f.write("4. **Collect feedback** from real-world usage\n")
        f.write("5. **Iterate** based on performance in production\n")
    
    print(f"✅ Comprehensive report saved: {report_path}")


def main():
    """Main analysis pipeline"""
    parser = argparse.ArgumentParser(description='Analyze YOLOv8 training results')
    parser.add_argument('--results-dir', type=str, 
                       default='runs/train/car_damage_detector',
                       help='Path to training results directory')
    parser.add_argument('--test-images', type=str,
                       default='datasets/car-damage/images/test',
                       help='Path to test images')
    
    args = parser.parse_args()
    
    print("\n" + "=" * 80)
    print("📊 YOLOv8 Training Results Analysis")
    print("=" * 80)
    
    # Find results directory
    results_dir = Path(args.results_dir)
    
    if not results_dir.exists():
        print(f"❌ Results directory not found: {results_dir}")
        print("Please run training first: python train.py")
        return
    
    # Load training results
    df = load_training_results(results_dir)
    if df is None:
        return
    
    # Plot training curves
    plot_training_curves(df, results_dir)
    
    # Analyze best metrics
    best_epoch, final_epoch = analyze_best_metrics(df)
    
    # Check overfitting
    overfitting_score = check_overfitting(df)
    
    # Test model on samples
    model_path = results_dir / 'weights' / 'best.pt'
    test_images_dir = Path(args.test_images)
    test_model_on_samples(model_path, test_images_dir)
    
    # Benchmark inference speed
    benchmark_results = benchmark_inference_speed(model_path)
    
    # Generate comprehensive report
    generate_report(results_dir, df, best_epoch, final_epoch, overfitting_score, benchmark_results)
    
    print("\n" + "=" * 80)
    print("✅ Analysis Complete!")
    print("=" * 80)
    print(f"\nResults saved in: {results_dir}")
    print("\nKey files:")
    print("  📈 training_analysis.png - Training curves")
    print("  📄 training_analysis_report.md - Comprehensive report")
    print("  🖼️  test_result_*.jpg - Sample predictions")
    print("\nNext: Review results and deploy if satisfactory!")


if __name__ == '__main__':
    main()
