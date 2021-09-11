const { FarmCategories: FarmCategoryModel } = require( '../models/index.js' );
const HttpException = require( '../utils/HttpException.utils.js' );
const responseCode = require( '../utils/responseCode.utils.js' );
const { checkValidation } = require( '../utils/auth.utils.js' );


class FarmCategoryController {

    listCategories = async ( req, res, next ) => {

        const categories = await FarmCategoryModel.findAll();
        if ( !categories || categories.length == 0 ) {
            new HttpException( res, responseCode.notFound, 'No category registered.' );
            return;
        }


        res.status( responseCode.oK ).json( {
            status: responseCode.oK,
            message: 'Farms fetched successfully.',
            data: categories
        } );

    };

    createCategory = async ( req, res, next ) => {
        const isValid = await checkValidation( req, res );
        if ( !isValid ) return;

        let category = await FarmCategoryModel.findOne( { where: { category: req.body.category } } );
        if ( category ) {
            new HttpException( res, responseCode.badRequest, 'Category already exists.' );
            return;
        }

        category = await FarmCategoryModel.create( req.body );

        if ( !category ) {
            new HttpException( res, responseCode.internalServerError, 'Something went wrong.' );
            return;
        }

        res.status( responseCode.created ).json( {
            status: responseCode.created,
            message: 'Category created successfully.',
            data: category.dataValues
        } );

    };
}


module.exports = new FarmCategoryController;