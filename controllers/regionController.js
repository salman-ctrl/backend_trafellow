const Region = require('../models/Region');

const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

exports.getAllRegions = async (req, res) => {
  try {
    const regions = await Region.getAll();
    res.json({
      success: true,
      data: regions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.getRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.findById(id);

    if (!region) {
      return res.status(404).json({ 
        success: false,
        message: 'Region tidak ditemukan' 
      });
    }

    res.json({
      success: true,
      data: region
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

exports.createRegion = async (req, res) => {
  try {
    const regionData = { ...req.body };

    if (regionData.name) {
      regionData.slug = createSlug(regionData.name);
    }

    if (req.file) {
      regionData.image = req.file.path;
    }

    const regionId = await Region.create(regionData);

    res.status(201).json({
      success: true,
      message: 'Region berhasil dibuat',
      data: { region_id: regionId }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

exports.updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const existingRegion = await Region.findById(id);
    if (!existingRegion) {
      return res.status(404).json({
        success: false,
        message: 'Region not found'
      });
    }

    if (updateData.name) {
      updateData.slug = createSlug(updateData.name);
    }

    if (req.file) {
      updateData.image = req.file.path;
    }

    await Region.update(id, updateData);

    res.json({
      success: true,
      message: 'Region berhasil diupdate'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

exports.deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.findById(id);
    
    if (!region) {
      return res.status(404).json({
        success: false,
        message: 'Region not found'
      });
    }

    await Region.delete(id);

    res.json({
      success: true,
      message: 'Region berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};