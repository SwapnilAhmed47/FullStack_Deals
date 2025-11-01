const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()

app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://smartDbUser:wk8Lzemtmnj8NM8z@cluster0.cnb6fbt.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db('smart_db')
    const productsCollection = db.collection("products")
    const bidsCollection = db.collection("bids")

    app.get('/products', async(req, res)=>{
        // const projectField = {title:1, _id:0, price_min:1, price_max:1, image:1}
        // const cursor = productsCollection.find().sort({price_min:1}).skip(2).limit(5).project(projectField);
        
        const email = req.query.email
        const query = {}
        if(email){
            query.email = email
        }
        console.log(query)
        const cursor = productsCollection.find(query)
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get("/products/:id", async(req, res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await productsCollection.findOne(query)
        res.send(result)
    })

    app.post('/products', async(req, res)=>{
        const newProduct = req.body
        const result = await productsCollection.insertOne(newProduct)
        res.send(result)
    })

    app.patch('/products/:id', async(req, res)=>{
        const id = req.params.id
        const query = {_id:new ObjectId(id)}
        const UpdateProduct = req.body
        const update = {
            $set:{
                name: UpdateProduct.name,
                price:UpdateProduct.price
            }
        }
        const options = {}
        const result = await productsCollection.updateOne(query, update, options);
        res.send(result)

        
    })

    app.delete('/products/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)}
        const result = await productsCollection.deleteOne(query)
        res.send(query)
    })

    // bids related api
    app.get('/bids', async(req, res)=>{
        const query = {}
        const email = req.query.email
        console.log(email)
        if(email){
            query.buyer_email = email
        }
        
        const cursor = bidsCollection.find(query);
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post('/bids', async(req, res)=>{
        const newBid = req.body
        const result = await bidsCollection.insertOne(newBid)
        res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("Server Created for Smart-deals")
})

app.listen(port, ()=>{
    console.log("server running on", port)
})



// fundamental practice
// client.connect()
// .then(()=>{
//     app.listen(port, ()=>{
//         console.log("Smart Server is running", port)
//     })
// })
// .catch(console.dir)


//smartDbUser
//wk8Lzemtmnj8NM8z