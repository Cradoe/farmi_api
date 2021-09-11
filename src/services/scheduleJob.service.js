const cron = require( 'node-cron' );

const scheduleJob = ( task, time = '*/2 * * * *' ) => {
    cron.schedule( time, async () => {
        await task();
    } );
}


module.exports = scheduleJob;