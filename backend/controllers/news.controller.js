import News from '../models/news.model.js';

export const createNews = async (req,res) =>{
    const {title, content, department, crossBranch} = req.body;

    try {
        const news = new News(
            {
                title,
                content,
                department,
                crossBranch,
                postedBy: req.user._id
            }
        );
        await news.save();

        res.status(201).json(news);
    } catch (error) {
        console.log("error in createNews controller: ", error.message);
        res.status(500).json({error: error.message});
    }
};

export const getNews = async (req,res) =>{
    const {department} = req.user;

    try {
        const news = await News.find({
            $or: [
                {department},
                {crossBranch: true}
            ]
        }).sort({ datePosted: -1});

        res.json(news);
    } catch (error) {
        console.log("Error in getNews controller: ", error.message);
        res.status(500).json({ error: error.message});
    }
};