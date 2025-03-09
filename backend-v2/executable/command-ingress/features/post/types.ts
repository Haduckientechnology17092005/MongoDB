import { UserEntity } from '../user/types';

type PostCreationDto = {
  markdown: string;
  title: string;
  image: string;
  authorID: string;
  tags: string[];
}

type UpdatePostDto = {
  markdown: string;
  title: string;
  image: string;
  tags: string[];
};

type PostEntity = {
  id: string;
  markdown: string;
  title: string;
  authorID: string;
  image: string;
  tags: string[];
  summary: string;
  createdAt: number;
  author?: UserEntity;
}

interface PostService {
  createPost(postCreationDto: PostCreationDto): Promise<PostEntity>;
  fetchPostsByUser(id: string): Promise<PostEntity[]>;
  getPost(id: string): Promise<PostEntity>
  editPost(id: string, editPostDto: UpdatePostDto): Promise<PostEntity>;
  deletePost(id: string): Promise<void>;
  getPostsNewFeed(sub: string): Promise<PostEntity[]>;
}

export {
  PostService,
  PostCreationDto,
  UpdatePostDto,
  PostEntity,
};
