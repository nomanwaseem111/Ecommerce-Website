import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 3000


const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    shopName: { type: String, required: true },
    numberOfSale: { type: Number, required: true },
    productRating: { type: Number, required: true },
    isFreeShipping: { type: Boolean, required: true },
    currencyCode: { type: String, required: true },
    createdOn: { type: Date, default: Date.now() }
});

const productModel = mongoose.model('product', productSchema);



app.post('/product', async (req, res) => {


    let body = req.body

    if (!body.productName ||
        !body.productPrice ||
        !body.shopName
        || !body.numberOfSale
        || !body.productRating
        || !body.isFreeShipping
        || !body.currencyCode) {

        res.status(401).send("Please Fill All Required Fields")
        return;
    }


    let result = await productModel.create({

        productName: body.productName,
        productPrice: body.productPrice,
        shopName: body.shopName,
        numberOfSale: body.numberOfSale,
        productRating: body.productRating,
        isFreeShipping: body.isFreeShipping,
        currencyCode: body.currencyCode,
    }).catch(e => {
        console.log("error in db", e);
        res.status(500).send({ message: "db error" })
        return;
    })

    console.log("result", result);
    res.status(200).send({ message: "Data Saved in Database" })

})



app.get('/products', async (req, res) => {

    let result = await productModel.find({})
        .exec()
        .catch(e => {
            console.log("getting eror in product", e);
            res.status(500).send({ message: "getting error in product" })
            return;
        })

    console.log("result: ", result);
    res.send({data: result})

})

app.get('/product/:id', async (req, res) => {

    

    let result = await productModel.findOne( {_id : req.params.id})
        .exec()
        .catch(e => {
            console.log("getting eror in product", e);
            res.status(500).send({ message: "getting error in edit product" })
            return;
        })

    console.log("result: ", result);
    res.send({data: result})

})

app.delete('/product/:id' , async (req,res) => {

    let _id = req.params.id;

    let response =  await productModel.findByIdAndDelete(_id).catch(e => {
        console.log("error ", e);
        res.status(500).send({message:"db error"})
        return;
    })

    console.log("response", response);
    res.status(200).send({message: "deleted Product"})   
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

let dbURI = "mongodb+srv://abc:abc@cluster0.bql8mte.mongodb.net/productDataBase?retryWrites=true&w=majority";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});