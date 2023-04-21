const { Router } = require( 'express' );
const { check } = require('express-validator');

const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto } = require( '../controllers/productos' );

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

/**
 *  {{ url }}/api/productos
 */

// Obtener todas los productos - público
router.get( '/',  obtenerProductos );

// Obtener un producto por id - público
router.get( '/:id', [
    check( 'id', 'No es un ID de Mongo válido' ).isMongoId(),
    check( 'id' ).custom( existeProductoPorId ),
    validarCampos
], obtenerProducto );

// Crear producto - privado - cualquier persona con token válido
router.post( '/', [ 
        validarJWT,
        check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
        check( 'categoria', 'No es un ID de Mongo válido' ).isMongoId(),
        check( 'categoria' ).custom( existeCategoriaPorId ),
        validarCampos
    ], crearProducto );

// Actualizar - privado - cualquiera con token válido
router.put( '/:id', [
    validarJWT,
    // check( 'categoria', 'No es un ID de Mongo válido' ).isMongoId(),
    check( 'id' ).custom( existeProductoPorId ),
    validarCampos
], actualizarProducto );

// Borrar un producto
router.delete( '/:id', [
    validarJWT,
    esAdminRole,
    check( 'id', 'No es un ID de Mongo válido' ).isMongoId(),
    check( 'id' ).custom( existeProductoPorId ),
    validarCampos,    
], borrarProducto );

module.exports = router;