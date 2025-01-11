const mongoose = require('mongoose');

async function Connection() {
    const uri = "mongodb+srv://admin:KAnM2ywXHsQ0tbfK@chatappcluster.jxil9.mongodb.net/?retryWrites=true&w=majority&appName=ChatAppCluster";
    const clientOptions = {
        serverApi: { version: '1', strict: true, deprecationErrors: true}
    };

    try {
        // Connect to MongoDB
        await mongoose.connect(uri, clientOptions);
        console.log("Connected to MongoDB Atlas!");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
    }
}

module.exports = Connection;








// const mongoose = require('mongoose')
// function Connection() {
//     const uri = "mongodb+srv://admin:KAnM2ywXHsQ0tbfK@chatappcluster.jxil9.mongodb.net/?retryWrites=true&w=majority&appName=ChatAppCluster"
//     // mongoose.connect(mongoURI)
//     // .then(() => console.log("Connected to MongoDB Atlas"))
//     // .catch(err => console.error("Error connecting to MongoDB Atlas:", err));
//
//     const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
//
//     async function run() {
//         try {
//             // Connect to MongoDB
//             await mongoose.connect(uri, clientOptions);
//             console.log("Connected to MongoDB Atlas!");
//         } catch (err) {
//             console.error("Error connecting to MongoDB Atlas:", err);
//         }
// }
// run().catch(console.dir);
// }
//
// module.exports = Connection;


// KAnM2ywXHsQ0tbfK   admin

// async function run() {
//     try {
//         // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//         await mongoose.connect(uri, clientOptions);
//         await mongoose.connection.db.admin().command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await mongoose.disconnect();
//     }
// }
// run().catch(console.dir);