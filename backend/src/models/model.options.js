const modelOptions = {
    toJSON: {
        Virtuals: true,
        transform: (_, obj) => {
            delete odj._id;
            return obj
        }
    },
    toObject: {
        Virtuals: true,
        transform: (_, obj) => {
            delete odj._id;
            return obj
        }
    },
    versionKey: false,
    timestamps: true
}

export default modelOptions;