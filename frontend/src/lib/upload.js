import { API } from "../api";

/**
 * Chunked upload: init -> PUT chunks -> complete.
 * onProgress receives 0..100. Resolves the saved file {id, url, name, kind, size}.
 */
export async function uploadFile(file, onProgress = () => {}) {
    const { data: init } = await API.post("/admin/uploads/init", {
        filename: file.name,
        size: file.size,
        content_type: file.type || "",
    });
    const { upload_id, chunk_size, total_chunks } = init;
    let sent = 0;
    for (let i = 0; i < total_chunks; i++) {
        const blob = file.slice(i * chunk_size, Math.min((i + 1) * chunk_size, file.size));
        await API.put(`/admin/uploads/${upload_id}/chunk/${i}`, blob, {
            headers: { "Content-Type": "application/octet-stream" },
            onUploadProgress: (e) => {
                const partial = sent + (e.loaded || 0);
                onProgress(Math.min(99, Math.round((partial / file.size) * 100)));
            },
        });
        sent += blob.size;
        onProgress(Math.min(99, Math.round((sent / file.size) * 100)));
    }
    const { data } = await API.post(`/admin/uploads/${upload_id}/complete`);
    onProgress(100);
    return data;
}
