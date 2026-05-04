import Newsletter from '../../models/newsletter.js';

export async function subscribeEmail(email) {
    const subscriber = new Newsletter({ email });
    return subscriber.save();
}

export async function getAllSubscribers() {
    return Newsletter.find().sort({ createdAt: -1 });
}

export async function isAlreadySubscribed(email) {
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    return !!existing;
}

export async function unsubscribeEmail(id) {
    return Newsletter.findByIdAndDelete(id);
}
