import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

interface ImageCropperModalProps {
  open: boolean;
  imageUrl: string;
  crop: Point;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  confirming?: boolean;
  onCropChange: (value: Point) => void;
  onZoomChange: (value: number) => void;
  onCropComplete: (areaPixels: Area) => void;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  zoomLabel?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmingLabel?: string;
}

export default function ImageCropperModal({
  open,
  imageUrl,
  crop,
  zoom,
  minZoom = 1,
  maxZoom = 4,
  confirming = false,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onCancel,
  onConfirm,
  title = "Adjust Image",
  description = "Drag and zoom. The circle is the visible area.",
  zoomLabel = "Zoom",
  cancelLabel = "Cancel",
  confirmLabel = "Save",
  confirmingLabel = "Uploading...",
}: ImageCropperModalProps) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4">
      <div className="my-8 w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{description}</p>

        <div className="relative mt-4 h-64 w-full overflow-hidden rounded-xl bg-slate-900 sm:h-72">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            objectFit="cover"
            minZoom={minZoom}
            maxZoom={maxZoom}
            cropShape="round"
            showGrid={false}
            classes={{ containerClassName: "cursor-grab active:cursor-grabbing" }}
            style={{
              cropAreaStyle: {
                border: "2px solid rgba(255,255,255,0.95)",
                color: "rgba(0, 0, 0, 0.72)",
              },
            }}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={(_, areaPixels) => onCropComplete(areaPixels)}
          />
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-xs text-slate-600">{zoomLabel}</label>
          <input
            type="range"
            min={minZoom}
            max={maxZoom}
            step={0.01}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={confirming}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {confirming ? confirmingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
