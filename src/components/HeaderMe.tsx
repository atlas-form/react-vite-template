import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import {
  getUploadAvatarSignApi,
  meApi,
  updateProfileApi,
  uploadWithSignedUrlApi,
} from "@/api";
import type { UserInfo } from "@/models/userModel";

const OUTPUT_SIZE = 512;

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function createCroppedAvatarFile(
  imageSrc: string,
  cropPixels: Area,
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context unavailable");
  }

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((nextBlob) => {
      if (!nextBlob) {
        reject(new Error("Failed to export cropped image"));
        return;
      }
      resolve(nextBlob);
    }, "image/png");
  });

  return new File([blob], `avatar-${Date.now()}.png`, { type: "image/png" });
}

export default function HeaderMe() {
  const [me, setMe] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const [cropOpen, setCropOpen] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const loadMe = async () => {
    try {
      const data = await meApi();
      setMe(data);
    } catch {
      // Keep fallback display when request fails.
    }
  };

  useEffect(() => {
    void loadMe();
  }, []);

  const closeCropModal = () => {
    setCropOpen(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    if (cropImageUrl) {
      URL.revokeObjectURL(cropImageUrl);
      setCropImageUrl("");
    }
  };

  const startCropAvatar = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const nextUrl = URL.createObjectURL(file);
    if (cropImageUrl) {
      URL.revokeObjectURL(cropImageUrl);
    }

    setCropImageUrl(nextUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1.2);
    setCroppedAreaPixels(null);
    setCropOpen(true);
  };

  const onConfirmUploadAvatar = async () => {
    if (!cropImageUrl || !croppedAreaPixels) return;

    setSavingAvatar(true);
    try {
      const avatarFile = await createCroppedAvatarFile(cropImageUrl, croppedAreaPixels);
      const sign = await getUploadAvatarSignApi();
      await uploadWithSignedUrlApi(avatarFile, sign, {
        contentType: avatarFile.type || "image/png",
      });
      await updateProfileApi({ avatar: sign.upload_url });
      await loadMe();
      closeCropModal();
      setMenuOpen(false);
    } finally {
      setSavingAvatar(false);
    }
  };

  const displayName = me?.name || "User";
  const avatarText = displayName.charAt(0).toUpperCase();
  const avatarUrl = me?.avatar || "";
  const cropperModal =
    cropOpen && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4">
            <div className="my-8 w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
              <h3 className="text-base font-semibold text-slate-900">Adjust Avatar</h3>
              <p className="mt-1 text-xs text-slate-500">
                Drag and zoom. The circle is the visible avatar area.
              </p>

              <div className="relative mt-4 h-64 w-full overflow-hidden rounded-xl bg-slate-900 sm:h-72">
                <Cropper
                  image={cropImageUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  objectFit="cover"
                  minZoom={1}
                  maxZoom={4}
                  cropShape="round"
                  showGrid={false}
                  classes={{ containerClassName: "cursor-grab active:cursor-grabbing" }}
                  style={{
                    cropAreaStyle: {
                      border: "2px solid rgba(255,255,255,0.95)",
                      color: "rgba(0, 0, 0, 0.72)",
                    },
                  }}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                />
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-xs text-slate-600">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeCropModal}
                  disabled={savingAvatar}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void onConfirmUploadAvatar()}
                  disabled={savingAvatar || !croppedAreaPixels}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {savingAvatar ? "Uploading..." : "Save Avatar"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 pr-3 shadow-sm transition hover:bg-slate-50"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {avatarText}
            </span>
          )}
          <span className="max-w-28 truncate text-sm">{displayName}</span>
          <svg
            className={`h-4 w-4 text-slate-500 transition-transform ${menuOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) {
                  startCropAvatar(file);
                }
                e.currentTarget.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={savingAvatar}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100"
            >
              Upload Avatar
            </button>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
            >
              Profile
            </Link>
            <Link
              to="/logout"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
      {cropperModal}
    </>
  );
}
