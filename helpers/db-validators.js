const { Usuario, Role, Categoria, Producto } = require('../models');

const esRolValido = async ( rol = '' ) => {
    const existeRole = await Role.findOne( { rol } );
    if (!existeRole) {
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    }
}

const emailExiste = async ( correo = '' ) => {
    const existeEmail = await Usuario.findOne( { correo } );
    if ( existeEmail ) {
        throw new Error( `El correo ${ correo } ya está registrado` );
    }
}

const existeUsuarioPorId = async ( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario || !existeUsuario.estado ) {
        throw new Error( `El id no existe ${ id }` );
    }
}

const existeCategoriaPorId = async ( id ) => {
    const categoria = await Categoria.findById( id );
    if ( !categoria || !categoria.estado ) {
        throw new Error( `El id no existe ${ id }` );
    }
}

const existeProductoPorId = async ( id ) => {
    const producto = await Producto.findById( id );
    if ( !producto ) {
        throw new Error( `El id no existe ${ id }` );
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
}