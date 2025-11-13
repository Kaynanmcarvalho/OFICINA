"""
Dataset Validation Script

Valida dataset antes do treinamento
Verifica integridade, distribuição de classes, qualidade das anotações

@author Torq AI Team
@version 1.0.0
"""

import os
import yaml
from pathlib import Path
from collections import Counter
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image
import numpy as np

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (15, 10)


def load_config():
    """Load dataset configuration"""
    with open('car_damage.yaml', 'r') as f:
        return yaml.safe_load(f)


def check_paths(config):
    """Check if all paths exist"""
    print("=" * 60)
    print("📁 Checking Paths")
    print("=" * 60)
    
    dataset_path = Path(config['path'])
    
    if not dataset_path.exists():
        print(f"❌ Dataset path not found: {dataset_path}")
        return False
    
    print(f"✅ Dataset path: {dataset_path}")
    
    # Check splits
    splits = ['train', 'val', 'test']
    for split in splits:
        images_path = dataset_path / config.get(split, f'images/{split}')
        labels_path = dataset_path / 'labels' / split
        
        if not images_path.exists():
            print(f"❌ {split} images not found: {images_path}")
            return False
        
        if not labels_path.exists():
            print(f"⚠️  {split} labels not found: {labels_path}")
        else:
            print(f"✅ {split} split found")
    
    return True


def count_images_and_labels(config):
    """Count images and labels for each split"""
    print("\n" + "=" * 60)
    print("📊 Counting Images and Labels")
    print("=" * 60)
    
    dataset_path = Path(config['path'])
    splits = ['train', 'val', 'test']
    
    stats = {}
    
    for split in splits:
        images_path = dataset_path / config.get(split, f'images/{split}')
        labels_path = dataset_path / 'labels' / split
        
        # Count images
        image_files = list(images_path.glob('*.jpg')) + list(images_path.glob('*.png'))
        
        # Count labels
        label_files = list(labels_path.glob('*.txt')) if labels_path.exists() else []
        
        stats[split] = {
            'images': len(image_files),
            'labels': len(label_files),
            'matched': 0
        }
        
        # Check matching
        matched = 0
        for img_file in image_files:
            label_file = labels_path / f"{img_file.stem}.txt"
            if label_file.exists():
                matched += 1
        
        stats[split]['matched'] = matched
        
        print(f"\n{split.upper()}:")
        print(f"  Images: {stats[split]['images']}")
        print(f"  Labels: {stats[split]['labels']}")
        print(f"  Matched: {stats[split]['matched']}")
        
        if stats[split]['images'] != stats[split]['matched']:
            print(f"  ⚠️  {stats[split]['images'] - stats[split]['matched']} images without labels")
    
    return stats


def analyze_class_distribution(config):
    """Analyze class distribution across dataset"""
    print("\n" + "=" * 60)
    print("📈 Analyzing Class Distribution")
    print("=" * 60)
    
    dataset_path = Path(config['path'])
    class_names = config['names']
    splits = ['train', 'val', 'test']
    
    class_counts = {split: Counter() for split in splits}
    
    for split in splits:
        labels_path = dataset_path / 'labels' / split
        
        if not labels_path.exists():
            continue
        
        for label_file in labels_path.glob('*.txt'):
            with open(label_file, 'r') as f:
                for line in f:
                    parts = line.strip().split()
                    if parts:
                        class_id = int(parts[0])
                        class_counts[split][class_id] += 1
    
    # Print statistics
    for split in splits:
        if class_counts[split]:
            print(f"\n{split.upper()}:")
            total = sum(class_counts[split].values())
            print(f"  Total annotations: {total}")
            
            for class_id in sorted(class_counts[split].keys()):
                count = class_counts[split][class_id]
                percentage = (count / total) * 100
                class_name = class_names.get(class_id, f"class_{class_id}")
                print(f"  {class_name:20s}: {count:5d} ({percentage:5.1f}%)")
    
    # Plot distribution
    plot_class_distribution(class_counts, class_names)
    
    return class_counts


def plot_class_distribution(class_counts, class_names):
    """Plot class distribution"""
    fig, axes = plt.subplots(1, 3, figsize=(18, 5))
    
    splits = ['train', 'val', 'test']
    colors = ['#3498db', '#2ecc71', '#e74c3c']
    
    for idx, split in enumerate(splits):
        if not class_counts[split]:
            continue
        
        # Prepare data
        classes = []
        counts = []
        
        for class_id in sorted(class_counts[split].keys()):
            class_name = class_names.get(class_id, f"class_{class_id}")
            classes.append(class_name)
            counts.append(class_counts[split][class_id])
        
        # Plot
        axes[idx].barh(classes, counts, color=colors[idx], alpha=0.7)
        axes[idx].set_xlabel('Count')
        axes[idx].set_title(f'{split.upper()} Set')
        axes[idx].grid(axis='x', alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('dataset_distribution.png', dpi=150, bbox_inches='tight')
    print(f"\n✅ Distribution plot saved: dataset_distribution.png")


def check_image_quality(config):
    """Check image quality and sizes"""
    print("\n" + "=" * 60)
    print("🖼️  Checking Image Quality")
    print("=" * 60)
    
    dataset_path = Path(config['path'])
    train_path = dataset_path / config.get('train', 'images/train')
    
    # Sample images
    image_files = list(train_path.glob('*.jpg')) + list(train_path.glob('*.png'))
    sample_size = min(100, len(image_files))
    sample_files = np.random.choice(image_files, sample_size, replace=False)
    
    sizes = []
    aspects = []
    formats = []
    
    for img_file in sample_files:
        try:
            with Image.open(img_file) as img:
                sizes.append(img.size)
                aspects.append(img.size[0] / img.size[1])
                formats.append(img.format)
        except Exception as e:
            print(f"⚠️  Error reading {img_file}: {e}")
    
    # Statistics
    widths = [s[0] for s in sizes]
    heights = [s[1] for s in sizes]
    
    print(f"\nSample size: {len(sizes)} images")
    print(f"\nWidth:")
    print(f"  Min: {min(widths)}px")
    print(f"  Max: {max(widths)}px")
    print(f"  Mean: {np.mean(widths):.0f}px")
    print(f"  Median: {np.median(widths):.0f}px")
    
    print(f"\nHeight:")
    print(f"  Min: {min(heights)}px")
    print(f"  Max: {max(heights)}px")
    print(f"  Mean: {np.mean(heights):.0f}px")
    print(f"  Median: {np.median(heights):.0f}px")
    
    print(f"\nAspect Ratio:")
    print(f"  Min: {min(aspects):.2f}")
    print(f"  Max: {max(aspects):.2f}")
    print(f"  Mean: {np.mean(aspects):.2f}")
    
    print(f"\nFormats:")
    format_counts = Counter(formats)
    for fmt, count in format_counts.most_common():
        print(f"  {fmt}: {count}")
    
    # Plot sizes
    plot_image_sizes(widths, heights)


def plot_image_sizes(widths, heights):
    """Plot image size distribution"""
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))
    
    # Width distribution
    axes[0].hist(widths, bins=30, color='#3498db', alpha=0.7, edgecolor='black')
    axes[0].set_xlabel('Width (px)')
    axes[0].set_ylabel('Count')
    axes[0].set_title('Image Width Distribution')
    axes[0].grid(alpha=0.3)
    
    # Height distribution
    axes[1].hist(heights, bins=30, color='#2ecc71', alpha=0.7, edgecolor='black')
    axes[1].set_xlabel('Height (px)')
    axes[1].set_ylabel('Count')
    axes[1].set_title('Image Height Distribution')
    axes[1].grid(alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('image_sizes.png', dpi=150, bbox_inches='tight')
    print(f"\n✅ Size distribution plot saved: image_sizes.png")


def check_annotation_quality(config):
    """Check annotation quality"""
    print("\n" + "=" * 60)
    print("🎯 Checking Annotation Quality")
    print("=" * 60)
    
    dataset_path = Path(config['path'])
    train_labels = dataset_path / 'labels' / 'train'
    
    if not train_labels.exists():
        print("❌ Training labels not found")
        return
    
    # Sample labels
    label_files = list(train_labels.glob('*.txt'))
    sample_size = min(100, len(label_files))
    sample_files = np.random.choice(label_files, sample_size, replace=False)
    
    bbox_sizes = []
    objects_per_image = []
    invalid_count = 0
    
    for label_file in sample_files:
        objects = 0
        with open(label_file, 'r') as f:
            for line in f:
                parts = line.strip().split()
                if len(parts) != 5:
                    invalid_count += 1
                    continue
                
                try:
                    class_id, x, y, w, h = map(float, parts)
                    
                    # Check if values are valid
                    if not (0 <= x <= 1 and 0 <= y <= 1 and 0 <= w <= 1 and 0 <= h <= 1):
                        invalid_count += 1
                        continue
                    
                    bbox_sizes.append(w * h)
                    objects += 1
                except:
                    invalid_count += 1
        
        objects_per_image.append(objects)
    
    print(f"\nSample size: {len(sample_files)} labels")
    print(f"Invalid annotations: {invalid_count}")
    
    if bbox_sizes:
        print(f"\nBBox Size (normalized):")
        print(f"  Min: {min(bbox_sizes):.4f}")
        print(f"  Max: {max(bbox_sizes):.4f}")
        print(f"  Mean: {np.mean(bbox_sizes):.4f}")
        print(f"  Median: {np.median(bbox_sizes):.4f}")
    
    if objects_per_image:
        print(f"\nObjects per Image:")
        print(f"  Min: {min(objects_per_image)}")
        print(f"  Max: {max(objects_per_image)}")
        print(f"  Mean: {np.mean(objects_per_image):.1f}")
        print(f"  Median: {np.median(objects_per_image):.0f}")


def generate_report(config, stats, class_counts):
    """Generate validation report"""
    print("\n" + "=" * 60)
    print("📄 Generating Report")
    print("=" * 60)
    
    report_path = Path('dataset_validation_report.md')
    
    with open(report_path, 'w') as f:
        f.write("# Dataset Validation Report\n\n")
        f.write(f"**Dataset**: {config['path']}\n")
        f.write(f"**Classes**: {len(config.get('names', {}))}\n\n")
        
        f.write("## Summary\n\n")
        f.write("| Split | Images | Labels | Matched |\n")
        f.write("|-------|--------|--------|--------|\n")
        for split, data in stats.items():
            f.write(f"| {split} | {data['images']} | {data['labels']} | {data['matched']} |\n")
        
        f.write("\n## Class Distribution\n\n")
        for split in ['train', 'val', 'test']:
            if class_counts[split]:
                f.write(f"\n### {split.upper()}\n\n")
                total = sum(class_counts[split].values())
                f.write(f"Total annotations: {total}\n\n")
                f.write("| Class | Count | Percentage |\n")
                f.write("|-------|-------|------------|\n")
                for class_id in sorted(class_counts[split].keys()):
                    count = class_counts[split][class_id]
                    percentage = (count / total) * 100
                    class_name = config['names'].get(class_id, f"class_{class_id}")
                    f.write(f"| {class_name} | {count} | {percentage:.1f}% |\n")
        
        f.write("\n## Recommendations\n\n")
        
        # Check for imbalanced classes
        train_counts = class_counts['train']
        if train_counts:
            max_count = max(train_counts.values())
            min_count = min(train_counts.values())
            ratio = max_count / min_count if min_count > 0 else float('inf')
            
            if ratio > 10:
                f.write("- ⚠️  **Class imbalance detected** (ratio: {:.1f}:1)\n".format(ratio))
                f.write("  - Consider collecting more data for underrepresented classes\n")
                f.write("  - Or use class weights during training\n\n")
        
        # Check dataset size
        total_train = stats['train']['images']
        if total_train < 500:
            f.write(f"- ⚠️  **Small training set** ({total_train} images)\n")
            f.write("  - Recommended: at least 500 images per class\n")
            f.write("  - Consider data augmentation\n\n")
        
        # Check validation size
        total_val = stats['val']['images']
        if total_val < 100:
            f.write(f"- ⚠️  **Small validation set** ({total_val} images)\n")
            f.write("  - Recommended: at least 100 images\n\n")
        
        f.write("\n## Files Generated\n\n")
        f.write("- `dataset_distribution.png` - Class distribution plots\n")
        f.write("- `image_sizes.png` - Image size distribution\n")
        f.write("- `dataset_validation_report.md` - This report\n")
    
    print(f"✅ Report saved: {report_path}")


def main():
    """Main validation pipeline"""
    print("\n" + "=" * 80)
    print("🔍 Dataset Validation")
    print("=" * 80)
    
    # Load config
    try:
        config = load_config()
    except FileNotFoundError:
        print("\n❌ car_damage.yaml not found")
        print("Please create the dataset configuration file first")
        return
    
    # Check paths
    if not check_paths(config):
        print("\n❌ Path validation failed")
        return
    
    # Count images and labels
    stats = count_images_and_labels(config)
    
    # Analyze class distribution
    class_counts = analyze_class_distribution(config)
    
    # Check image quality
    check_image_quality(config)
    
    # Check annotation quality
    check_annotation_quality(config)
    
    # Generate report
    generate_report(config, stats, class_counts)
    
    print("\n" + "=" * 80)
    print("✅ Validation Complete!")
    print("=" * 80)
    print("\nNext steps:")
    print("  1. Review dataset_validation_report.md")
    print("  2. Check dataset_distribution.png")
    print("  3. Fix any issues found")
    print("  4. Run: python train.py")


if __name__ == '__main__':
    main()
