const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/cloudinary');

router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);

router.post('/', 
  authenticate,
  isAdmin,
  upload.single('destination_image'),
  destinationController.createDestination
);

router.put('/:id', 
  authenticate,
  isAdmin,
  upload.single('destination_image'),
  destinationController.updateDestination
);

router.delete('/:id', 
  authenticate,
  isAdmin,
  destinationController.deleteDestination
);

module.exports = router;