"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const router = useRouter();

    async function handleSubmit() {
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, author }),
        });

        await res.json();
        router.push("/");
    }

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">글 작성</h1>
            <div className="space-y-4 mb-6">
                <input
                    type="text"
                    value={title}
                    placeholder="제목을 입력하세요"
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="text"
                    value={author}
                    placeholder="저자를 입력하세요"
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                    value={content}
                    placeholder="내용을 입력하세요"
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
                저장
            </button>
        </div>
    );
}
