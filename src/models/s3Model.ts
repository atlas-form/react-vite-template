export interface AccessSignQuery {
	key: string;
}

export interface DeleteSignQuery {
	key: string;
}

export interface UploadExtQuery {
	ext: string;
}

export interface SignedUploadHeaders {
	authorization: string;
	"x-amz-date": string;
	"x-amz-content-sha256": string;
	"Content-Type"?: string;
	"Content-Disposition"?: string;
}

export interface UploadSignResponse {
	method: "PUT";
	upload_url: string;
	key: string;
	headers: SignedUploadHeaders;
}

export interface DownloadSignResponse {
	method: "GET";
	download_url: string;
	key: string;
}

export interface DeleteSignResponse {
	method: "DELETE";
	delete_url: string;
	key: string;
	headers: SignedUploadHeaders;
}
