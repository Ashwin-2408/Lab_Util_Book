import BulkResourceAvailability from '../Schema/BulkResourceAvailability.js';
import BulkRequest from '../Schema/BulkRequest.js';
import Lab from '../Schema/Lab.js';
import { Op } from 'sequelize';
import sequelize from '../Schema/db_connection.js';

export const getBulkAvailability = async (req, res) => {
  try {
    const { labName, resourceType } = req.body;
    const whereClause = {};

    if (labName) {
      whereClause['$lab.lab_name$'] = { [Op.like]: `%${labName}%` };
    }
    if (resourceType) {
      whereClause.resource_type = { [Op.like]: `%${resourceType}%` };
    }

    const resources = await BulkResourceAvailability.findAll({
      where: whereClause,
      include: [{
        model: Lab,
        as: 'lab',
        attributes: ['lab_name']
      }]
    });

    res.status(200).json({ resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBulkRequest = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { userId, requests } = req.body;
    const results = [];

    // First, validate all requests
    for (const request of requests) {
      const { availabilityId, quantity } = request;
      const availability = await BulkResourceAvailability.findByPk(availabilityId, { transaction: t });
      
      if (!availability) {
        throw new Error(`Resource with ID ${availabilityId} not found`);
      }
      
      if (availability.available_quantity < quantity) {
        throw new Error(`Insufficient quantity available for resource ${availability.resource_type}`);
      }
    }

    // If validation passes, create all requests
    for (const request of requests) {
      const { availabilityId, quantity } = request;
      const availability = await BulkResourceAvailability.findByPk(availabilityId, { transaction: t });

      // Create request
      const bulkRequest = await BulkRequest.create({
        user_id: userId,
        availability_id: availabilityId,
        requested_quantity: quantity,
        status: 'pending',
        request_date: new Date()
      }, { transaction: t });

      // Update available and pending quantities
      await availability.update({
        pending_quantity: availability.pending_quantity + quantity,
        available_quantity: availability.available_quantity - quantity
      }, { transaction: t });

      results.push({
        request_id: bulkRequest.request_id,
        resource_type: availability.resource_type,
        quantity: quantity,
        status: 'pending'
      });
    }

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Bulk request created successfully',
      requests: results
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const getUserBulkRequests = async (req, res) => {
  try {
    const { userId } = req.body;
    const requests = await BulkRequest.findAll({
      where: { user_id: userId },
      include: [{
        model: BulkResourceAvailability,
        as: 'resourceAvailability',
        include: [{
          model: Lab,
          as: 'lab',
          attributes: ['lab_name']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    const formattedRequests = requests.map(request => ({
      request_id: request.request_id,
      resource_type: request.resourceAvailability.resource_type,
      lab_name: request.resourceAvailability.lab.lab_name,
      quantity: request.requested_quantity,
      status: request.status,
      request_date: request.createdAt
    }));

    res.status(200).json({
      success: true,
      requests: formattedRequests
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};