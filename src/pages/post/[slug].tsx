import { useState } from 'react';
import { PortableText } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import { format } from 'date-fns';
import { client } from '../../sanity/lib/client';
import styles from '../../styles/postPage.module.css';
import Image from 'next/image';
import { GetStaticProps, GetStaticPaths } from 'next';

interface Post {
  title: string;
  slug: { current: string };
  body: PortableTextBlock[];
  mainImage: {
    asset: { url: string };
    alt: string;
  };
  description: string;
  publishedAt: string;
  author: {
    name: string;
    image: { asset: { url: string } };
  };
  categories: { title: string }[];
}

interface PostProps {
  post: Post;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "post"]{slug}`;
  const posts = await client.fetch(query);

  const paths = posts.map((post: { slug: { current: string } }) => ({
    params: { slug: post.slug.current },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    body,
    mainImage{
      asset->{
        url
      },
      alt
    },
    description,
    publishedAt,
    author->{
      name,
      image{
        asset->{
          url
        }
      }
    },
    categories
  }`;

  const post = await client.fetch(query, { slug: params?.slug });

  return { props: { post } };
};

const PostPage = ({ post }: PostProps) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<{ name: string; comment: string }[]>([]);

  const handleCommentSubmit = () => {
    if (name && comment) {
      const newComment = { name, comment };
      setComments([newComment, ...comments]);
      setName('');
      setComment('');
    } else {
      alert('Please enter both your name and comment.');
    }
  };

  return (
    <div className={styles.postPageContainer}>
      <div className={styles.postContainer}>
        {/* Main Image */}
        {post.mainImage?.asset?.url && (
          <div className={styles.mainImageWrapper}>
            <Image
              src={post.mainImage.asset.url}
              alt={post.mainImage.alt || 'Post Image'}
              className={styles.image}
              width={1200}
              height={600}
              quality={100}
              layout="intrinsic"
            />
          </div>
        )}

        <div className={styles.contentWrapper}>
          {/* Post Title and Content */}
          <div className={styles.content}>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.description}>{post.description}</p>
            <div className={styles.authorWrapper}>
              {post.author?.image?.asset?.url && (
                <Image
                  src={post.author.image.asset.url}
                  alt={post.author.name}
                  className={styles.authorImage}
                  width={50}
                  height={50}
                />
              )}
              <div>
                <p className={styles.authorInfo}>{post.author?.name}</p>
                <p>{format(new Date(post.publishedAt), 'MMMM dd, yyyy')}</p>
              </div>
            </div>
            <div className={styles.content}>
              <PortableText value={post.body} />
            </div>
          </div>

          {/* Comment Section */}
          <div className={styles.commentSection}>
            <h3>Leave a Comment</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.commentInput}
            />
            <textarea
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className={styles.commentTextarea}
            />
            <button onClick={handleCommentSubmit} className={styles.commentButton}>
              Post Comment
            </button>

            {/* Displaying Comments */}
            <div className={styles.commentList}>
              {comments.map((item, index) => (
                <div key={index} className={styles.commentCard}>
                  <p><strong>{item.name}</strong></p>
                  <p>{item.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ensure you export the PostPage component correctly as the default export
export default PostPage;