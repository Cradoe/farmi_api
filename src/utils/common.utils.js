const getRandomNumber = ( e = 0, t = 100 ) => {
    return Math.random() * ( t - e ) + e;
}
exports.getRandomNumber = getRandomNumber;

exports.generateRandomCode = () => {
    for ( var e = "", t = 0; t < 10; t++ )
        e += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"[ Math.floor( getRandomNumber( 0, 61 ) ) ];
    return e;
}



