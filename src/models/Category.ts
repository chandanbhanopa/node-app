import * as mongoose from 'mongoose';


const categoryschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})


const Category = mongoose.model('category',categoryschema);

export default Category;