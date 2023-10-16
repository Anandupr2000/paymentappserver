const { MongoClient, ServerApiVersion } = require('mongodb');
const state = {
    db: null
}
module.exports.connect = async function (done) {
    // const url = 'mongodb://localhost:27017'
    let service = 'mongodb+srv'
    let pass = 123;
    let username = 'anonymous_'
    let hostname = 'cluster0.7xuld.mongodb.net'

    const uri = service + '://' + username + ':' + pass + '@' + hostname
    const dbname = 'PaymentApp'
    // mongoClient.connect(url, (err, data) => {
    //     if (err) return done(err)    // returning error object on failed connection to called line through callback
    //     state.db = data.db(dbname)
    //     done()
    // })

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db(dbname).command({ ping: 1 });
        state.db = client.db(dbname)
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        done()
    }
    catch (err) {
        done(err)
    }
}

module.exports.get = () => {
    if (!(state.db))
        this.connect()
    return state.db
}