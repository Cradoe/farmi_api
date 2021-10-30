
const HttpException = require( '../utils/HttpException.utils.js' );
const responseCode = require( '../utils/responseCode.utils.js' );
const { checkValidation } = require( '../utils/auth.utils.js' );

const { Farms: FarmModel, FarmModerators: FarmModeratorModel, FarmGallery: FarmGalleryModel } = require( '../models/index.js' );
const { formatStaticFilePath } = require( '../utils/common.utils.js' );

class FarmController {

    createFarm = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        req.body.farmer_id = req.currentUser.id;
        const result = await FarmModel.findOne( { where: { farm_name: req.body.farm_name } } );

        if ( result && Number( result.dataValues.farmer_id ) === Number( req.body.farmer_id ) ) {
            new HttpException( res, responseCode.badRequest, 'This farm has already been registered by you.' );
            return;
        }

        const newFarm = await FarmModel.create( { ...req.body, logo: formatStaticFilePath( req, req.file ? req.file.filename : 'default-logo.jpg' ) } );
        if ( !newFarm ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong' );
            return;
        }

        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Farm registered successfully.',
            data: newFarm.dataValues
        } );

    };

    editFarm = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        const farm = await FarmModel.findOne( { where: { id: req.params.id } } );
        if ( !farm ) {
            new HttpException( res, responseCode.notFound, 'No result found.' );
            return;
        } else if ( Number( farm.dataValues.farmer_id ) !== Number( req.currentUser.id ) ) {
            new HttpException( res, responseCode.unauthorized, 'Access Denied. You are not the rightful owner of this farm.' );
            return;
        }

        const result = await FarmModel.update( { ...req.body }, { where: { id: req.params.id } } );
        if ( !result ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Couldn\'t update record at the moment.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Farm updated successfully.',
            data: { ...farm.dataValues, ...req.body }
        } );

    };

    singleFarm = async ( req, res, next ) => {
        const farm = await FarmModel.findOne( { where: { id: req.params.id } } );
        if ( !farm ) {
            new HttpException( res, responseCode.notFound, 'No result found.' );
            return;
        }


        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Farm details fetched successfully.',
            data: farm.dataValues
        } );

    };

    deleteFarm = async ( req, res, next ) => {

        const farm = await FarmModel.findOne( { where: { id: req.params.id } } );
        if ( !farm ) {
            new HttpException( res, responseCode.notFound, 'No result found.' );
            return;
        } else if ( Number( farm.dataValues.farmer_id ) !== Number( req.currentUser.id ) ) {
            new HttpException( res, responseCode.unauthorized, 'Permission Denied. You are not the rightful owner of this farm.' );
            return;
        } else if ( farm.dataValues.status === 'deleted' ) {
            new HttpException( res, responseCode.unauthorized, 'This farm is no longer active.' );
            return;
        }

        const result = await FarmModel.update( { status: 'deleted' }, { where: { id: farm.dataValues.id } } );
        if ( !result ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Couldn\'t delete record at the moment.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Farm deleted successfully.'
        } );

    };

    deleteFarmModerator = async ( req, res, next ) => {
        const moderatorAccount = await FarmModeratorModel.findOne( { where: { user_id: req.params.user_id, farm_id: req.params.user_id } } );
        if ( !moderatorAccount ) {
            new HttpException( res, responseCode.notFound, 'No account found' );
            return;
        } else if ( moderatorAccount.dataValues.status === 'deleted' ) {
            new HttpException( res, responseCode.unauthorized, 'This moderator account is no longer valid.' );
            return;
        }

        const result = await FarmModeratorModel.update( { status: 'deleted' }, { where: { id: moderatorAccount.dataValues.id } } );

        if ( !result ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Couldn\'t delete record at the moment.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Moderator Account deleted successfully.'
        } );

    };

    addGallery = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        const farm = await FarmModel.findByPk( req.body.farm_id );

        if ( !farm ) {
            new HttpException( res, responseCode.badRequest, 'This farm is not registered.' );
            return;
        }

        if ( req.files && Array.isArray( req.files ) ) {

            Promise.all(
                req.files.map( ( file ) => {
                    return new Promise( async ( resolve ) => {
                        const newFile = await FarmGalleryModel.create( { farm_id: req.body.farm_id, image: formatStaticFilePath( req, file.filename ) } );

                        if ( newFile ) {
                            resolve( {
                                filename: file.filename,
                                url: newFile.dataValues.image
                            } );
                        } else {
                            new HttpException( res, responseCode.internalServerError, 'Something went wrong. Unable to upload the file.' );
                            return;
                        }
                    } );
                } )
            ).then( ( uploadedFiles ) => {

                res.status( responseCode.created ).json( {
                    status: responseCode.created,
                    message: 'Files uploaded successfuly.',
                    data: uploadedFiles
                } );
            } ).catch( error => {
                new HttpException( res, responseCode.internalServerError, 'Something went wrong. Unable to upload the file.' );
                return;
            } );
        }
    };

    galleryFiles = async ( req, res, next ) => {


        const gallery = await FarmGalleryModel.findAll( { where: { farm_id: req.params.farm_id } } );

        if ( !gallery ) {
            new HttpException( res, responseCode.badRequest, 'You have not added any gallery.' );
            return;
        }

        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Gallery fetched successfuly.',
            data: gallery
        } );
    };
}


module.exports = new FarmController;