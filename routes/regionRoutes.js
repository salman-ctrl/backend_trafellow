const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/cloudinary');

router.get('/', regionController.getAllRegions);
router.get('/:id', regionController.getRegionById);

router.post('/', 
  authenticate, 
  isAdmin, 
  upload.single('region_image'),
  regionController.createRegion
);

router.put('/:id', 
  authenticate, 
  isAdmin, 
  upload.single('region_image'),
  regionController.updateRegion
);

router.delete('/:id', 
  authenticate, 
  isAdmin, 
  regionController.deleteRegion
);

module.exports = router;