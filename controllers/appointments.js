const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');

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
            select : 'name province'
        }).populate({
            path : 'user',
            select : 'name role'
        });
    } else {
        if (req.params.hospitalId) {
            // console.log(req.params.hospitalId);
            query = Appointment.find({hospital: req.params.hospitalId}).populate({
                path : 'hospital',
                select : 'name province'
            }).populate({
                path : 'user',
                select : 'name role'
            });
        } else {
        query = Appointment.find().populate({
            path : 'hospital',
            select : 'name province'
        }).populate({
            path : 'user',
            select : 'name role'
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
        console.log(err);
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
            select : 'name description'
        }).populate({
            path : 'user',
            select : 'name role'
        });

        if (!appointment) {
            return res.status(404).json({
                success : false,
                msg : `No apppointment ${req.params.id}`
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

// desc     Add appointment
// route    POST /api/v1/hospitals/:hospitalId/appointment
// access   Private
exports.addAppointment = async (req,res,next) => {
    try {
        // console.log(req.params.hospitalId);
        // add hospitalId, logged-in userId to req.body
        req.body.hospital = req.params.hospitalId;
        req.body.user = req.user.id;
        console.log(req.user);

        // check for existed hospital & existed appointment
        const hospital = await Hospital.findById(req.params.hospitalId);
        const existedAppointment = await Appointment.find({user: req.user.id});

        // if the user is't admin, he can create only 3 appointments
        if (existedAppointment.length >= 3 && req.user.id !== 'admin') {
            return res.status(400).json({
                success : false,
                msg : `User ${req.user.id} already has 3 appointments`
            });
        }

        if (!hospital) {
            return res.status(404).json({
                success : false,
                msg : `No hospital ${req.params.hospitalId}`
            });
        }

        const apppointment = await Appointment.create(req.body);

        res.status(200).json({
            success : true,
            data : apppointment
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success : false,
            msg : "Can't create appointment"
        });
    }
}

// desc     Update appointment
// route    PUT /api/v1/appointments/:id
// access   Private
exports.updateAppointment = async (req,res,next) => {
    // console.log(req.params.id);
    // console.log(req.body);
    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success : false,
                msg : `No appointment ${req.params.id}`
            });
        }

        // verify whether logged-in user is the appointment owner
        if (req.user.role !== 'admin' && appointment.user.toString() !== req.user.id) {
            return res.status(401).json({
                success : false,
                msg : `User ${req.user.id} isn't authorized to update this appointment`
            });
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        }).populate({
            path : 'hospital',
            select : 'name description'
        }).populate({
            path : 'user',
            select : 'name role'
        });

        res.status(200).json({
            success : true,
            data : appointment
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success : false,
            msg : "Can't update the apppointment"
        });
    }
};

// desc     Delete appointment
// route    DELETE /api/v1/appointments/:id
// access   Private
exports.deleteAppointment = async (req,res,next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success : false,
                msg : `No appointment ${req.params.id}`
            });
        }
        
        // verify whether logged-in user is the appointment owner
        if (req.user.role !== 'admin' && appointment.user.toString() !== req.user.id) {
            return res.status(401).json({
                success : false,
                msg : `User ${req.user.id} isn't authorized to delete this appointment`
            });       
        }

        await appointment.deleteOne();

        res.status(200).json({
            success : true,
            data : {}
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success : false,
            msg : "Can't delete the appointment"
        });
    }
};