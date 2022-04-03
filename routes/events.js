/*
    Rutas de Eventos
    host + /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { getEvents, createEvent, deleteEvent, updateEvent } = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const { validateFields } = require("../middlewares/field-validators");
const { validateJWT } = require("../middlewares/jwt-validators");

const router = Router();

// Todas las rutas tienen que pasar por la validación del JWT
router.use(validateJWT);

router.get('/', getEvents);

router.post(
    '/',
    [ //middlewares
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fecha de finalización es obligatoria').custom(isDate),
        validateFields
    ],
    createEvent
);

router.put(
    '/:id',
    [ //middlewares
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fecha de finalización es obligatoria').custom(isDate),
        validateFields
    ],
    updateEvent
);

router.delete('/:id', deleteEvent);

module.exports = router;