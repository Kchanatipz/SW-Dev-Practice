const express = require('express');

const {getAppointments} = require('../controllers/appointments');
const {protect} = require('../middleware/auth');

const router = express.Router({mergeParams: true});

console.log('HI from appointment router');
router.route('/').get(protect, getAppointments);

module.exports = router;