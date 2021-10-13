import mongoose from 'mongoose';
const { Schema } = mongoose;

const styleCountSchema = new Schema({
    digital: Number,
    abstract: Number,
    landscape: Number
})

export let styleCount = null
if (process.env.NODE_ENV === 'production') {
    styleCount = mongoose.model('count', styleCountSchema, 'count')
}
else {
    styleCount = mongoose.model('count_test', styleCountSchema, 'count_test')
}