import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";

interface Post {
  _id: string;
  slug: { current: string };
  title: string;
  description?: string;
  mainImage?: { asset: { url: string } };
  author?: { name: string };
  publishedAt: string;
  categories: { _id: string; title: string }[];
}

async function fetchPosts(): Promise<Post[]> {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    mainImage {
      asset-> { url }
    },
    author-> { name },
    publishedAt,
    categories[]-> { _id, title }
  }`;

  const posts = await client.fetch(query);
  return posts;
}

const HomePage = async () => {
  const posts = await fetchPosts();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-white ">Blog Posts</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {posts.map((post) => (
          <li
            key={post.slug.current}
            className="bg-white p-6 rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl"
          >
            <Link href={`/post/${post.slug.current}`}>
              <div className="block cursor-pointer">
                {post.mainImage?.asset?.url ? (
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={post.mainImage.asset.url}
                      alt={post.title}
                      className="object-cover w-full h-full"
                      width={500}
                      height={300}
                      placeholder="blur"
                      blurDataURL="/placeholder-image.jpg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {post.description || "No description available."}
                  </p>
                  <div className="flex items-center space-x-2 text-gray-500 text-xs">
                    {post.author && <span>{post.author.name}</span>}
                    <span>•</span>
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {post.categories.length > 0 && (
                    <div className="flex flex-wrap mt-2 space-x-2">
                      {post.categories.map((category) => (
                        <span
                          key={category._id}
                          className="px-3 py-1 text-sm bg-blue-100 text-black rounded-full"
                        >
                          {category.title}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4">
                    <span className="inline-block px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-blue-700">
                      View More
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
