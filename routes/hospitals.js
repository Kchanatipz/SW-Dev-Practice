const express = require('express');
const {getHospitals, getHospital, createHospital, updateHospital, deleteHospital} = require('../controllers/hospitals');
const router = express.Router();
const {protect,authorize} = require('../middleware/auth');
const appointmentRouter = require('./appointments');

// re-route into other resource routers
router.use('/:idhospitalId/appointments/',appointmentRouter);

router.route('/').get(getHospitals).post(protect, authorize('admin'), createHospital);
router.route('/:id').get(getHospital);
router.route('/:id').put(protect,authorize('admin'), updateHospital).delete(protect, authorize('admin'), deleteHospital);

module.exports = router;