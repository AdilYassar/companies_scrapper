const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/CompanyController');
const authMiddleware = require('../middleware/auth.middleware');

const companyController = new CompanyController();

// Company CRUD endpoints
router.get('/', authMiddleware, companyController.getCompanies.bind(companyController));
router.get('/stats', authMiddleware, companyController.getCompanyStats.bind(companyController));
router.get('/export', authMiddleware, companyController.exportCompanies.bind(companyController));
router.get('/:id', authMiddleware, companyController.getCompany.bind(companyController));
router.put('/:id', authMiddleware, companyController.updateCompany.bind(companyController));
router.delete('/:id', authMiddleware, companyController.deleteCompany.bind(companyController));

module.exports = router;
