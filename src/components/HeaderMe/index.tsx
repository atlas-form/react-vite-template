import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { Area, Point } from "react-easy-crop";
import {
  getUploadAvatarSignApi,
  meApi,
  updateProfileApi,
  uploadWithSignedUrlApi,
} from "@/api";
import ImageCropperModal from "@/components/base/ImageCropperModal";
import type { UserInfo } from "@/models/userModel";
import { createCroppedImageFile } from "@/utils/imageCrop";

export default function HeaderMe() {
  const [me, setMe] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const [cropOpen, setCropOpen] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2);
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

  useEffect(() => {
    void loadMe();
  }, []);

  const loadMe = async () => {
    try {
      const data = await meApi();
      setMe(data);
    } catch {
      // Keep fallback display when request fails.
    }
  };

  const closeCropModal = () => {
    setCropOpen(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1.2);
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
      const avatarFile = await createCroppedImageFile(cropImageUrl, croppedAreaPixels, {
        outputSize: 512,
        mimeType: "image/png",
        fileName: `avatar-${Date.now()}.png`,
      });
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

      <ImageCropperModal
        open={cropOpen}
        imageUrl={cropImageUrl}
        crop={crop}
        zoom={zoom}
        confirming={savingAvatar}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={setCroppedAreaPixels}
        onCancel={closeCropModal}
        onConfirm={() => void onConfirmUploadAvatar()}
        title="Adjust Avatar"
        description="Drag and zoom. The circle is the visible avatar area."
      />
    </>
  );
}
