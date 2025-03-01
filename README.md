# SGroup Blog App

The platform for sharing knowledge, which contains three components:
- Frontend application
- Backend API (command-ingress)
- MongoDB-Redis connector

How to run:
  - ```docker compose up```
  - ```npm run dev:comamnd-ingress```

How to run test:
  - ```npm run test``` (Make sure you Docker is enabled)

Architecture: ![Screenshot](https://imgur.com/3iY4uc3.png)


## Feed System Design

### Recipe
 - User's feed could contains posts from:
   - Following users
   - Recently interested tags

### Distribute Post
#### Fan-out on read
- At the first approach, we could just query directly from the database:
```
import mongoose from 'mongoose';

// Assuming you have Post and User models defined with Mongoose
const Post = mongoose.model('Post');
const User = mongoose.model('User');

async function getFollowingPosts(currentUserId: mongoose.Types.ObjectId) {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'sender_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'follows',
          localField: 'user._id',
          foreignField: 'followee_id',
          as: 'followers',
        },
      },
      {
        $match: {
          'followers.follower_id': currentUserId,
        },
      },
    ]);

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

```
- Although this approach works well at first, heavy load will stress the database at scale.
- Benchmark result by using k6


#### Fan-out on write
- Along side of fetching posts on read requests, we could pre-build user's feeds contents which data is stored on fast-access storage like Redis, Memcache, Valkey, ...
- With fan-out on write, the post will be distributed to followers cache:
  ![fan-out.png](./Screenshot%202025-02-28%20at%2023.03.11.png)

- Drawbacks:
  - We could easily observe that if users has a large amout of followers, than fan-out on write pattern could lead to a huge amount of write operations

### Feeds design
- For you:
  - This kind of feeds will need a Recommendation System for better post suggestions.
- Following:
  - Use the approach 2 above.
  - In the future, if there's a user with large amout of followers, we'll classify and create a specific service for celebrities.
