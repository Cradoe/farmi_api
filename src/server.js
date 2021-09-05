const express = require( "express" );
const dotenv = require( "dotenv" );
const cors = require( "cors" );
const bodyParserPkg = require( 'body-parser' );

const HttpException = require( './utils/HttpException.utils.js' );
const { errorMiddleware } = require( './middleware/error.middleware.js' );

const swaggerUi = require( "swagger-ui-express" );
const swaggerApiSpec = require( './services/swagger.service.js' );

const accountRouter = require( './routes/account.route.js' );
const farmRouter = require( './routes/farm.route.js' );
const farmerRouter = require( './routes/farmer.route.js' );

const dbConfiguration = require( './models/index.js' );

const { json, urlencoded } = bodyParserPkg;

const app = express();

dotenv.config();

app.use( express.json() );
// enabling cors for all requests by using cors middleware
app.use( cors() );
// Enable pre-flight
app.options( "*", cors() );

app.use( json() )
app.use( urlencoded( { extended: true } ) )

const port = Number( process.env.PORT || 3000 );

dbConfiguration.sequelize.sync().then( () => {
    console.log( "Nice! Database looks good." );
} ).catch( err => {
    console.log( err, "Something went wrong. Couldn't connect to db" );
} );

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup( swaggerApiSpec )
);

app.use( `/account`, accountRouter );
app.use( `/farm`, farmRouter );
app.use( `/farmer`, farmerRouter );


// 404 error
app.all( '*', ( req, res, next ) => {
    const err = new HttpException( 404, 'Endpoint Not Found' );
    next( err );
} );

// Error middleware
app.use( errorMiddleware );



const start = () => {
    try {
        // starting the server
        app.listen( port, () =>
            console.log( `🚀 Server running on port ${port}!` ) );
    } catch ( e ) {
        console.error( e )
    }
}

module.exports = start;