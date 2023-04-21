const { response } = require( 'express' );
const { ObjectId } = require( 'mongoose' ).Types;
const { Usuario, Categoria, Producto } = require( '../models' );

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles',
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        } );
    }

    const regex = new RegExp( termino, 'i' );

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });


}

const buscar = async ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    switch ( coleccion ) {
        case 'usuarios':
            await buscarUsuarios( termino, res );
            break;
        case 'categoria':
            break;
        case 'productos':
            break;
        default:
            res.status( 500 ).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            });
    }



    // res.json({
    //     msg: 'Buscar...',
    //     coleccion,
    //     termino
    // });

}


module.exports = {
    buscar
}