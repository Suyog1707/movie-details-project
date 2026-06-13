const modelOptions = {
    toJSON: {
        Virtuals: true,
        transform: (_, obj) => {
            delete obj._id;
            return obj
        }
    },
    toObject: {
        Virtuals: true,
        transform: (_, obj) => {
            delete obj._id;
            return obj
        }
    },
    versionKey: false,
    timestamps: true
}

export default modelOptions;