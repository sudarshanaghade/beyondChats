const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// GET all articles
router.get('/articles', async (req, res) => {
    try {
        const articles = await Article.findAll();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET article by ID
router.get('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).json({ error: 'Article not found' });
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new article
router.post('/articles', async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update article
router.put('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).json({ error: 'Article not found' });

        await article.update(req.body);
        res.json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
