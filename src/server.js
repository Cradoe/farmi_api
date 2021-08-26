import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import HttpException from './utils/HttpException.utils.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import accountRouter from './routes/account.route.js';
import bodyParserPkg from 'body-parser';

import swaggerUi from "swagger-ui-express";
import swaggerApiSpec from './services/swagger.service.js';

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

const port = Number( process.env.PORT || 3331 );


app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup( swaggerApiSpec )
);



app.use( `/account`, accountRouter );


// 404 error
app.all( '*', ( req, res, next ) => {
    const err = new HttpException( 404, 'Endpoint Not Found' );
    next( err );
} );

// Error middleware
app.use( errorMiddleware );


export const start = () => {
    try {
        // starting the server
        app.listen( port, () =>
            console.log( `🚀 Server running on port ${port}!` ) );
    } catch ( e ) {
        console.error( e )
    }
}
