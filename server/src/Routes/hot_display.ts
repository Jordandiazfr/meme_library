import mongoose from "mongoose"

/* Create a new mongoose Schema for a meme document

const memeSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String, required: true, index: { unique: true } },
    url: { type: String, required: true },
    date: {
        type: Date,
        default: Date.now
    }
})
*/

const memeSchema = new mongoose.Schema({
    _id: { type: String },
    url: { type: String, required: true }})

/* Create a mongoose model that connects the Schema with the collection */

const collection = "memes"

/* delete mongoose.connection.models[collection]; */ 

let Meme = mongoose.models.Meme  || mongoose.model(collection, memeSchema)


let All_memes 

/* Define the route
export default async function getMemes(req, res) {
    try {

        All_memes =  await Meme.find().sort({date:-1})
          res.send(All_memes)
    } catch (error) {
        console.log(error)   
    }
  
  
}*/

/* Define the route */
export default async function getMemes(req, res) {
    try {

        All_memes =  await Meme.find()
          res.send(All_memes)
    } catch (error) {
        console.log(error)   
    }
  
  
}