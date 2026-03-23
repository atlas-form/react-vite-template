import type {
	AccessSignQuery,
	DeleteSignQuery,
	DeleteSignResponse,
	DownloadSignResponse,
	UploadExtQuery,
	UploadSignResponse,
} from "@/models/s3Model";
import { request } from "./base";

export const getAccessSignApi = async (
	query: AccessSignQuery,
): Promise<DownloadSignResponse> => {
	return request<AccessSignQuery, DownloadSignResponse>({
		method: "GET",
		url: "/sign/access",
		body: query,
		group: "file",
	});
};

export const getDeleteSignApi = async (
	query: DeleteSignQuery,
): Promise<DeleteSignResponse> => {
	return request<DeleteSignQuery, DeleteSignResponse>({
		method: "GET",
		url: "/sign/delete",
		body: query,
		group: "file",
	});
};

export const getUploadAvatarSignApi = async (): Promise<UploadSignResponse> => {
	return request<undefined, UploadSignResponse>({
		method: "GET",
		url: "/sign/upload/avatar",
		group: "file",
	});
};

export const getUploadDocumentSignApi = async (
	query: UploadExtQuery,
): Promise<UploadSignResponse> => {
	return request<UploadExtQuery, UploadSignResponse>({
		method: "GET",
		url: "/sign/upload/document",
		body: query,
		group: "file",
	});
};

export const getUploadImageSignApi = async (
	query: UploadExtQuery,
): Promise<UploadSignResponse> => {
	return request<UploadExtQuery, UploadSignResponse>({
		method: "GET",
		url: "/sign/upload/image",
		body: query,
		group: "file",
	});
};

export const uploadWithSignedUrlApi = async (
	file: File,
	sign: UploadSignResponse,
	options?: {
		contentType?: string;
	},
): Promise<Response> => {
	const headers = new Headers({
		Authorization: sign.headers.authorization,
		"x-amz-date": sign.headers["x-amz-date"],
		"x-amz-content-sha256": sign.headers["x-amz-content-sha256"],
	});

	if (sign.headers["Content-Type"]) {
		headers.set("Content-Type", sign.headers["Content-Type"]);
	} else if (options?.contentType) {
		headers.set("Content-Type", options.contentType);
	}
	if (sign.headers["Content-Disposition"]) {
		headers.set("Content-Disposition", sign.headers["Content-Disposition"]);
	}

	const res = await fetch(sign.upload_url, {
		method: "PUT",
		headers,
		body: file,
	});

	if (!res.ok) {
		throw new Error(`Upload failed: ${res.status}`);
	}
	return res;
};

export const deleteWithSignedUrlApi = async (
	sign: DeleteSignResponse,
): Promise<Response> => {
	const headers = new Headers({
		Authorization: sign.headers.authorization,
		"x-amz-date": sign.headers["x-amz-date"],
		"x-amz-content-sha256": sign.headers["x-amz-content-sha256"],
	});

	const res = await fetch(sign.delete_url, {
		method: "DELETE",
		headers,
	});

	if (!res.ok) {
		throw new Error(`Delete failed: ${res.status}`);
	}
	return res;
};
