const express = require('express');
const router = express.Router();
const { getAllBatches, createBatch, getBatchById, updateBatch } = require('../controllers/batchController');

router.get('/',          getAllBatches);
router.post('/',         createBatch);
router.get('/:batchId',  getBatchById);
router.put('/:batchId',  updateBatch);

module.exports = router;
