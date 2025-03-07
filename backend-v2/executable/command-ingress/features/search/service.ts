import asyncHandler from 'express-async-handler';
import user from '../../../../internal/model/user';
import post from '../../../../internal/model/post';
export const postSearch = asyncHandler(async (req, res, next) => {
    const {keyword} = req.query;
    if(!keyword) {
        res.status(400).json({
            message: 'keyword is required'
        });
        return;
    }
    const posts = await post.find({
        $text: {
            $search: keyword.toString()
        }
    });
    res.status(200).json({posts})
});

export const topicSearch = asyncHandler(async (req, res, next) => {
    const {tags} = req.query;
    if(!tags) {
        res.status(400).json({
            message: 'tags is required'
        });
        return;
    }
    const tagsArray = Array.isArray(tags) ? tags : [tags];  
    //tim bai viet co it nhat 1 tag trung
    const relatedPosts = await post.find({
        tags: {
            $in: tagsArray
        }
    });
    res.status(200).json({posts: relatedPosts});
});

export const userSearch = asyncHandler(async (req, res, next) => {
    const {userName} = req.query;
    if(!userName) {
        res.status(400).json({
            message: 'userName is required'
        });
        return;
    }
    const users = await user.find({
        $text: {
            $search: userName.toString()
        }
    });
    res.status(200).json({users});
});
