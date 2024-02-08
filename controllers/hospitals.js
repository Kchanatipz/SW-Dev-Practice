const { json } = require('express');
const Hospital = require('../models/Hospital');

// desc     Get all hospitals
// route    GET /api/v1/hospitals
// access   Public
exports.getHospitals =  async (req,res,next) => {
    // res.status(200).json({success:true, msg:'Create new hospitals'});
    try {
        const hospital = await Hospital.find();
        res.status(200).json({
            success: true,
            count: hospital.length,
            data: hospitals
        });
    } catch(err) {
        res.status(400),json({success: false});
    }
}

// desc     Get single hospital
// route    GET /api/v1/hospitals/:id
// access   Public
exports.getHospital = async (req,res,next) => {
    // res.status(200).json({success:true, msg:`Show hospital ${req.params.id}`});
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({
            success: true,
            data: hospital
        });
    } catch(err) {
        res.status(400).json({success: false});
    }
}

// desc     Create new hospital
// route    POST /api/v1/hospitals
// access   Private
exports.createHospital = async (req,res,next) => {
    // console.log(req.body);
    // res.status(200).json({success:true, msg:'Create new hospitals'});
    const hospital = await Hospital.create(req.body);
    res.status(201).json({
        succes:true,
        data:hospital
    });
}

// desc     Update hospital
// route    PUT /api/v1/hospitals/:id
// access   Private
exports.updateHospital = async (req,res,next) => {
    // res.status(200).json({success:true, msg:`Update hospital ${req.params.id}`});
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!hospital) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({
            success: true,
            data: hospital
        });
    } catch(err) {
        res.status(400).json({success: false});
    }
}

// desc     Delete hospital
// route    DELETE /api/v1/hospitals/:id
// access   Private
exports.deleteHospital = async (req,res,next) => {
    // res.status(200).json({success:true, msg:`Delete hospital ${req.params.id}`});
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);

        if (!hospital) {
            return res.status(400).json({
                succes: false,
                data: {}
            });
        }
        res.status(200).json({success: true});
    } catch {
        res.status(400).json({success: false});
    }
}