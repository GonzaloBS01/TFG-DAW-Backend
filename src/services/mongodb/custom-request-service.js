import CustomRequest from '../../models/custom-request.js';

export async function saveCustomRequest(data) {
    const request = new CustomRequest(data);
    return request.save();
}

export async function getAllCustomRequests() {
    return CustomRequest.find().sort({ createdAt: -1 });
}

export async function updateCustomRequestStatus(id, status) {
    return CustomRequest.findByIdAndUpdate(id, { status }, { new: true });
}
