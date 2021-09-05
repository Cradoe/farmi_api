exports.multipleColumnSet = ( object, concatString = ', ' ) => {
    if ( typeof object !== 'object' ) {
        throw new Error( 'Invalid input' );
    }

    const keys = Object.keys( object );
    const values = Object.values( object );

    let columnSet = keys.map( key => `${key} = ?` ).join( concatString );

    return {
        columnSet,
        values
    }
}
const getRandomNumber = ( e = 0, t = 100 ) => {
    return Math.random() * ( t - e ) + e;
}
exports.getRandomNumber = getRandomNumber;

exports.generateRandomCode = () => {
    for ( var e = "", t = 0; t < 10; t++ )
        e += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"[ Math.floor( getRandomNumber( 0, 64 ) ) ];
    return e;
}



