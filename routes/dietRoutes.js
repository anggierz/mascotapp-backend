const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createDiet, getDietsByPetId, updateDiet, deleteDiet} = require('../controllers/dietController');

router.use(auth);

router.post('/', createDiet);
router.get('/:id', getDietsByPetId);
router.put('/:id', updateDiet);
router.delete('/:id', deleteDiet);

module.exports = router;
