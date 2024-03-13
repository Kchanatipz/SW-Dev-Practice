const express = require('express');

const {getAppointments, getAppointment, addAppointment} = require('../controllers/appointments');
const {protect} = require('../middleware/auth');

const router = express.Router({mergeParams: true});

router.route('/').get(protect, getAppointments).post(addAppointment);
router.route('/:id').get(getAppointment);

module.exports = router;