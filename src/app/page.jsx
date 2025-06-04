import Link from "next/link";

export default async function Home() {
    const res = await fetch("http://localhost:3000/api/posts", {
        cache: "no-store",
    });
    const data = await res.json();
    console.log(data);

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">글 목록</h1>
            {data.length === 0 ? (
                <p className="text-gray-500 text-center">
                    작성된 글이 없습니다.
                </p>
            ) : (
                <ul className="space-y-4 mb-8">
                    {data.map((post) => (
                        <li
                            key={post.id}
                            className="bg-white rounded-lg shadow p-4 flex items-center justify-between hover:shadow-lg transition"
                        >
                            <div>
                                <span className="font-semibold text-blue-600 mr-2">
                                    {post.author}
                                </span>
                                <span>
                                    :
                                    <Link
                                        href={`/post/${post.id}`}
                                        className="ml-2 text-lg font-medium text-gray-900 hover:underline"
                                    >
                                        {post.title}
                                    </Link>
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <Link href="/post/new">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">
                    글 작성
                </button>
            </Link>
        </div>
    );
}
