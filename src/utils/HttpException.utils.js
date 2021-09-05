
const dotenv = require( "dotenv" );
dotenv.config();
class HttpException {
    constructor ( res, status, message, error ) {
        this.status = status;
        this.message = message;
        this.res = res;
        this.error = error;
        this.init();
    }
    init = () => {
        if ( process.env.ENVIRONMENT === 'development' ) {
            console.log( this.error );
        }
        this.res.status( this.status ).json( {
            status: this.status,
            message: this.message
        } );
    }
}
module.exports = HttpException;