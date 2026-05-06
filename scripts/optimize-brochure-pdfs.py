from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image
from pypdf import PdfWriter
import pypdfium2 as pdfium


def optimize_pdf(
    source_path: Path,
    target_path: Path,
    max_dim: int = 1600,
    jpeg_quality: int = 52,
    png_quality: int = 60,
) -> None:
    writer = PdfWriter(clone_from=str(source_path))
    processed_refs: set[tuple[int, int] | str] = set()

    for page in writer.pages:
        for image_file in list(page.images):
            ref = getattr(image_file, "indirect_reference", None)
            key: tuple[int, int] | str
            if ref is not None:
                key = (int(ref.idnum), int(ref.generation))
            else:
                key = image_file.name

            if key in processed_refs:
                continue
            processed_refs.add(key)

            image = image_file.image
            width, height = image.size
            longest = max(width, height)

            if longest > max_dim:
                scale = max_dim / float(longest)
                resized = (
                    max(1, int(width * scale)),
                    max(1, int(height * scale)),
                )
                image = image.resize(resized, Image.Resampling.LANCZOS)

            has_alpha = image.mode in {"RGBA", "LA"} or "transparency" in image.info
            if has_alpha:
                image = image.convert("RGB")

            image_file.replace(
                image.convert("RGB"),
                quality=jpeg_quality,
                optimize=True,
                progressive=True,
            )

    target_path.parent.mkdir(parents=True, exist_ok=True)
    with target_path.open("wb") as out_file:
        writer.write(out_file)


def optimize_pdf_raster(
    source_path: Path,
    target_path: Path,
    dpi: int = 92,
    jpeg_quality: int = 48,
) -> None:
    pdf = pdfium.PdfDocument(str(source_path))
    rendered_images: list[Image.Image] = []
    scale = dpi / 72.0

    try:
        for page in pdf:
            bitmap = page.render(scale=scale)
            image = bitmap.to_pil().convert("RGB")
            rendered_images.append(image)
            page.close()
            bitmap.close()
    finally:
        pdf.close()

    if not rendered_images:
        raise RuntimeError(f"No pages rendered for {source_path}")

    first_image, remaining_images = rendered_images[0], rendered_images[1:]
    target_path.parent.mkdir(parents=True, exist_ok=True)
    first_image.save(
        target_path,
        "PDF",
        save_all=True,
        append_images=remaining_images,
        resolution=dpi,
        quality=jpeg_quality,
        optimize=True,
    )


def find_pdf_files(base_dir: Path) -> list[Path]:
    return sorted(
        path
        for path in base_dir.rglob("*.pdf")
        if not path.name.lower().endswith("-low.pdf")
    )


def make_low_path(path: Path) -> Path:
    return path.with_name(f"{path.stem}-low.pdf")


def mb(size_bytes: int) -> float:
    return round(size_bytes / (1024 * 1024), 2)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate low-size brochure PDFs.")
    parser.add_argument(
        "--base-dir",
        default="public/universities",
        help="Base directory containing brochure PDFs",
    )
    parser.add_argument("--max-dim", type=int, default=1600, help="Max width/height per image")
    parser.add_argument("--jpeg-quality", type=int, default=52, help="JPEG quality for opaque images")
    parser.add_argument(
        "--raster-threshold-mb",
        type=float,
        default=10.0,
        help="Use raster optimization for files larger than this size in MB",
    )
    parser.add_argument("--raster-dpi", type=int, default=92, help="DPI for raster low-quality PDFs")
    parser.add_argument(
        "--keep-larger",
        action="store_true",
        help="Keep generated low files even if they are larger than source",
    )
    parser.add_argument("--dry-run", action="store_true", help="Only show what would be processed")
    args = parser.parse_args()

    base_dir = Path(args.base_dir)
    if not base_dir.exists():
        raise SystemExit(f"Base directory not found: {base_dir}")

    pdf_files = find_pdf_files(base_dir)
    if not pdf_files:
        print("No PDF files found.")
        return 0

    total_before = 0
    total_after = 0
    saved_count = 0

    for source_path in pdf_files:
        target_path = make_low_path(source_path)
        source_size = source_path.stat().st_size
        total_before += source_size

        if args.dry_run:
            print(f"[DRY] {source_path} -> {target_path}")
            continue

        source_mb = source_size / (1024 * 1024)
        use_raster = source_mb >= args.raster_threshold_mb
        if use_raster:
            optimize_pdf_raster(
                source_path=source_path,
                target_path=target_path,
                dpi=args.raster_dpi,
                jpeg_quality=args.jpeg_quality,
            )
        else:
            optimize_pdf(
                source_path=source_path,
                target_path=target_path,
                max_dim=args.max_dim,
                jpeg_quality=args.jpeg_quality,
            )

        target_size = target_path.stat().st_size if target_path.exists() else 0
        if target_size >= source_size and not args.keep_larger:
            target_path.unlink(missing_ok=True)
            print(f"{source_path.name}: skipped (low version not smaller)")
            continue

        saved_count += 1
        total_after += target_size
        reduction = 0.0 if source_size == 0 else (1 - (target_size / source_size)) * 100
        method = "raster" if use_raster else "stream"

        print(
            f"{source_path.name}: {mb(source_size)} MB -> {mb(target_size)} MB "
            f"({reduction:.1f}% smaller, {method})"
        )

    if not args.dry_run:
        global_reduction = 0.0 if total_before == 0 else (1 - (total_after / total_before)) * 100
        print(
            f"TOTAL: {mb(total_before)} MB -> {mb(total_after)} MB "
            f"({global_reduction:.1f}% smaller, {saved_count} low files kept)"
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
