const Appointment = require('../models/Appointment');
const { estimatedDocumentCount } = require('../models/Hospital');

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
        if (req.params.hospitalId) {
            console.log(req.params.hospitalId);
            query = Appointment.find({hospital: req.params.hospitalId}).populate({
                path : 'hospital',
                select : 'name province tel'
            });
        } else {
        query = Appointment.find().populate({
            path : 'hospital',
            select : 'name province tel'
        });
        }
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

// desc     Get single appointment
// route    GET /api/v1/appointment/:id
// access   Public
exports.getAppointment = async (req,res,next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path : 'hospital',
            select : 'name description tel'
        });

        if (!appointment) {
            return res.status(404).json({
                success : false,
                msg : `No apppointment with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success : true,
            data : appointment
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success : false,
            msg : "Can't find the appointment"
        });
    }
}