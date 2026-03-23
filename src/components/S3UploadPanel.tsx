import { useMemo, useState } from "react";
import {
	deleteWithSignedUrlApi,
	getAccessSignApi,
	getDeleteSignApi,
	getUploadAvatarSignApi,
	getUploadDocumentSignApi,
	getUploadImageSignApi,
	uploadWithSignedUrlApi,
} from "@/api";

type UploadKind = "avatar" | "image" | "document";

interface UploadState {
	key: string;
	uploadUrl: string;
	accessUrl?: string;
	deleted?: boolean;
}

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const DOC_EXTS = new Set(["pdf", "doc", "docx", "xls", "xlsx", "txt", "md"]);

function getFileExt(file: File): string {
	const fileName = file.name || "";
	const idx = fileName.lastIndexOf(".");
	if (idx < 0 || idx === fileName.length - 1) return "";
	return fileName.slice(idx + 1).toLowerCase();
}

export default function S3UploadPanel() {
	const [activeTab, setActiveTab] = useState<UploadKind>("avatar");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [records, setRecords] = useState<Partial<Record<UploadKind, UploadState>>>({});

	const current = records[activeTab];

	const title = useMemo(() => {
		if (activeTab === "avatar") return "Avatar";
		if (activeTab === "image") return "Image";
		return "Document";
	}, [activeTab]);

	const handleUpload = async (file: File) => {
		setLoading(true);
		setMessage("");
		try {
			let key = "";
			let uploadUrl = "";

			if (activeTab === "avatar") {
				const sign = await getUploadAvatarSignApi();
				await uploadWithSignedUrlApi(file, sign, {
					contentType: file.type || "application/octet-stream",
				});
				key = sign.key;
				uploadUrl = sign.upload_url;
			}

			if (activeTab === "image") {
				const ext = getFileExt(file);
				if (!IMAGE_EXTS.has(ext)) {
					throw new Error(`image ext not supported: ${ext || "<empty>"}`);
				}
				const sign = await getUploadImageSignApi({ ext });
				await uploadWithSignedUrlApi(file, sign);
				key = sign.key;
				uploadUrl = sign.upload_url;
			}

			if (activeTab === "document") {
				const ext = getFileExt(file);
				if (!DOC_EXTS.has(ext)) {
					throw new Error(`document ext not supported: ${ext || "<empty>"}`);
				}
				const sign = await getUploadDocumentSignApi({ ext });
				await uploadWithSignedUrlApi(file, sign);
				key = sign.key;
				uploadUrl = sign.upload_url;
			}

			setRecords((prev) => ({
				...prev,
				[activeTab]: {
					key,
					uploadUrl,
					deleted: false,
				},
			}));
			setMessage(`${title} upload success`);
		} catch (err) {
			const text = err instanceof Error ? err.message : String(err);
			setMessage(`${title} upload failed: ${text}`);
		} finally {
			setLoading(false);
		}
	};

	const handleAccessSign = async () => {
		if (!current?.uploadUrl) return;
		setLoading(true);
		setMessage("");
		try {
			const res = await getAccessSignApi({ key: current.uploadUrl });
			setRecords((prev) => ({
				...prev,
				[activeTab]: {
					...prev[activeTab],
					accessUrl: res.download_url,
				} as UploadState,
			}));
			setMessage(`${title} access sign success`);
		} catch (err) {
			const text = err instanceof Error ? err.message : String(err);
			setMessage(`${title} access sign failed: ${text}`);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteSign = async () => {
		if (!current?.uploadUrl) return;
		setLoading(true);
		setMessage("");
		try {
			const sign = await getDeleteSignApi({ key: current.uploadUrl });
			await deleteWithSignedUrlApi(sign);
			setRecords((prev) => ({
				...prev,
				[activeTab]: {
					...prev[activeTab],
					deleted: true,
				} as UploadState,
			}));
			setMessage(`${title} delete success`);
		} catch (err) {
			const text = err instanceof Error ? err.message : String(err);
			setMessage(`${title} delete failed: ${text}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mt-8 rounded-xl border border-gray-200 p-4">
			<div className="mb-4 flex gap-2">
				{(["avatar", "image", "document"] as UploadKind[]).map((tab) => (
					<button
						key={tab}
						type="button"
						disabled={loading}
						onClick={() => setActiveTab(tab)}
						className={`rounded px-3 py-1 text-sm ${
							activeTab === tab
								? "bg-blue-600 text-white"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						{tab}
					</button>
				))}
			</div>

			<div className="space-y-3">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Upload {title}
					</label>
					<input
						type="file"
						disabled={loading}
						accept={
							activeTab === "image" || activeTab === "avatar"
								? "image/*"
								: ".pdf,.doc,.docx,.xls,.xlsx,.txt,.md"
						}
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							void handleUpload(file);
							e.currentTarget.value = "";
						}}
						className="mt-1 block w-full text-sm"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						disabled={loading || !current?.uploadUrl || activeTab === "avatar"}
						onClick={() => void handleAccessSign()}
						className="rounded bg-indigo-600 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300"
					>
						Get Access Sign
					</button>
					<button
						type="button"
						disabled={loading || !current?.uploadUrl}
						onClick={() => void handleDeleteSign()}
						className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300"
					>
						Delete By Sign
					</button>
				</div>

				{message ? (
					<p className="text-sm text-gray-700 break-all">{message}</p>
				) : null}

				{current?.key ? (
					<div className="rounded bg-gray-50 p-3 text-xs text-gray-700 space-y-1">
						<p className="break-all">
							<span className="font-semibold">key:</span> {current.key}
						</p>
						<p className="break-all">
							<span className="font-semibold">uploadUrl:</span> {current.uploadUrl}
						</p>
						{current.accessUrl ? (
							<p className="break-all">
								<span className="font-semibold">accessUrl:</span> {current.accessUrl}
							</p>
						) : null}
						<p>
							<span className="font-semibold">deleted:</span>{" "}
							{current.deleted ? "yes" : "no"}
						</p>
					</div>
				) : null}
			</div>
		</div>
	);
}
