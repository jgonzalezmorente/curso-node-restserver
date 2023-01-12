const { Router } = require( 'express' );
const { check } = require('express-validator');

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria } = require('../controllers/categorias');

const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

/**
 *  {{ url }}/api/categorias
 */

// Obtener todas las categorías - público
router.get( '/',  obtenerCategorias );

// Obtener una categoría por id - público
router.get( '/:id', [
    check( 'id', 'No es un ID de Mongo válido' ).isMongoId(),
    check( 'id' ).custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria );

// Crear categoría - privado - cualquier persona con token válido
router.post( '/', [ 
        validarJWT,
        check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
        validarCampos
    ], crearCategoria );

// Actualizar - privado - cualquiera con token válido
router.put( '/:id', [
    validarJWT,
    check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
    check( 'id', 'El id de la categoría no es un id válido' ).isMongoId(),
    check( 'id' ).custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria );

// Borrar una categoría
router.delete( '/:id', [
    validarJWT,
    esAdminRole,
    check( 'id', 'El id de la categoría no es un id válido' ).isMongoId(),
    validarCampos,
    check( 'id' ).custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria );

module.exports = router;