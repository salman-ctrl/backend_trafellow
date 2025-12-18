const Destination = require('../models/Destination');

exports.createDestination = async (req, res) => {
  try {
    const {
      name,
      region_id,
      category_id,
      description,
      address,
      latitude,
      longitude,
      ticket_price
    } = req.body;

    if (!name || !region_id || !category_id || !description || !address) {
      return res.status(400).json({
        success: false,
        message: 'Name, region, category, description, and address are required'
      });
    }

    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path;
    }

    const destinationData = {
      name,
      region_id,
      category_id,
      description,
      address,
      latitude: latitude || null,
      longitude: longitude || null,
      ticket_price: ticket_price || 0,
      image: imagePath,
      created_by: req.user?.user_id || null
    };

    const destinationId = await Destination.create(destinationData);

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: { destination_id: destinationId }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message
    });
  }
};

exports.updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      region_id,
      category_id,
      description,
      address,
      latitude,
      longitude,
      ticket_price
    } = req.body;

    const existingDestination = await Destination.findById(id);
    if (!existingDestination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (region_id) updateData.region_id = region_id;
    if (category_id) updateData.category_id = category_id;
    if (description) updateData.description = description;
    if (address) updateData.address = address;
    if (latitude !== undefined) updateData.latitude = latitude || null;
    if (longitude !== undefined) updateData.longitude = longitude || null;
    if (ticket_price !== undefined) updateData.ticket_price = ticket_price || 0;

    if (req.file) {
      updateData.image = req.file.path;
    }

    await Destination.update(id, updateData);

    res.json({
      success: true,
      message: 'Destination updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message
    });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    await Destination.delete(id);

    res.json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

exports.getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findById(id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    await Destination.incrementViewCount(id);

    res.json({
      success: true,
      data: destination
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

exports.getAllDestinations = async (req, res) => {
  try {
    const { region_id, category_id, page = 1, limit = 10 } = req.query;

    const destinations = await Destination.findAll({
      region_id,
      category_id,
      page,
      limit
    });

    let countQuery = 'SELECT COUNT(*) as total FROM destinations WHERE 1=1';
    const countParams = [];

    if (region_id) {
      countQuery += ' AND region_id = ?';
      countParams.push(region_id);
    }

    if (category_id) {
      countQuery += ' AND category_id = ?';
      countParams.push(category_id);
    }

    const db = require('../config/database');
    const [totalCount] = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: destinations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount[0].total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};