const { response } = require( 'express' );
const { Categoria } = require( '../models' );


const obtenerCategorias = async ( req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
            .populate( 'usuario', 'nombre' )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);

    res.json({
        total,
        categorias
    });

}

const obtenerCategoria = async ( req, res = response ) => {

    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate( 'usuario', 'nombre' );

    res.json( categoria );

}

const crearCategoria = async ( req, res = respones ) => {

    const nombre = req.body.nombre.trim().toUpperCase();    
    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status( 400 ).json({
            msg: `La categoría ${ categoriaDB.nombre }, ya existe`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await new Categoria( data );
    await categoria.save();

    res.json( categoria );
    
}

const actualizarCategoria = async ( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } )
        .populate( 'usuario', 'nombre' );

    res.json( categoria );
}

const borrarCategoria = async ( req, res = response ) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true } )
        .populate( 'usuario', 'nombre' );;

    res.json( categoriaBorrada );
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
}