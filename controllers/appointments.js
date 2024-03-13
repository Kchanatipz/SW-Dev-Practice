const Appointment = require('../models/Appointment');

// desc     Get all appointments
    // normal user  -> only see their appointment
    // admin        -> see all appointments
// route    GET /api/v1/appointments
// access   Public
exports.getAppointments = async (req,res,next) => {
    let query;

    if (req.user.role !== 'admin') {
        query = Appointment.find({user : req.user.id}).populate({
            path : 'hospital',
            select : 'name province tel'
        });
    } else {
        query = Appointment.find().populate({
            path : 'hospital',
            select : 'name province tel'
        });;
    }

    try {
        const appointments = await query;

        res.status(200).json({
            success : true,
            count : appointments.length,
            data : appointments
        });
    } catch(err) {
        console.log(err.stack);
        res.status(500).json({
            success : false,
            msg : "Can't find the appointment"
        });
    }
}