import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    payer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    });

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;