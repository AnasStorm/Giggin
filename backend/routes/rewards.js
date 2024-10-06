const express = require('express');
const router = express.Router();
const db = require('../db');  // Assuming you have a db module for database queries

// Get all rewards from the reward catalog (for display)
router.get('/catalog', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM reward_catalog');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a user's redeemed rewards
router.get('/:userId/redeemed', async (req, res) => {
    const { userId } = req.params;

    try {
        const query = `
            SELECT rc.title, r.price
            FROM rewards r
            JOIN reward_catalog rc ON r.catalog_id = rc.id
            WHERE r.user_id = ?;
        `;
        const [results] = await db.execute(query, [userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No rewards found for this user' });
        }

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Redeem a reward for a user
router.post('/:userId/redeem', async (req, res) => {
    const { userId } = req.params;
    const { catalogId, price } = req.body; // Assuming you send catalogId and price in the request body

    try {
        // You can add logic here to check if the user has enough credits to redeem the reward
        // For simplicity, we skip that check

        // Insert the reward into the user's redeemed rewards
        const query = `
            INSERT INTO rewards (label, price, user_id, catalog_id)
            SELECT title, price, ?, id FROM reward_catalog WHERE id = ?
        `;
        await db.execute(query, [userId, catalogId]);

        res.status(201).json({ message: 'Reward redeemed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a user's reward (optional - for admin or user to remove redeemed rewards)
router.delete('/:userId/reward/:rewardId', async (req, res) => {
    const { userId, rewardId } = req.params;

    try {
        const query = 'DELETE FROM rewards WHERE id = ? AND user_id = ?';
        const [result] = await db.execute(query, [rewardId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reward not found for this user' });
        }

        res.status(200).json({ message: 'Reward removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
