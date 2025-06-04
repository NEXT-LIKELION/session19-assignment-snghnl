"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }) {
    const [data, setData] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState("");
    const [commentAuthor, setCommentAuthor] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetch(`http://localhost:3000/api/posts/${params.id}`)
            .then((res) => res.json())
            .then((data) => setData(data));
        fetch(`/api/post/${params.id}`)
            .then((res) => res.json())
            .then((comments) => setComments(comments));
    }, [params.id]);

    if (!data) {
        return <div>글을 찾을 수가 없습니다.</div>;
    }

    async function handleDelete() {
        const res = await fetch(`/api/posts/${params.id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            router.push("/");
        } else {
            alert("삭제 실패");
        }
    }

    async function handleAddComment() {
        if (!commentContent || !commentAuthor) return;
        const res = await fetch(`/api/posts/${params.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                author: commentAuthor,
                content: commentContent,
            }),
        });
        if (res.ok) {
            const newComment = await res.json();
            setComments((prev) => [...prev, newComment]);
            setCommentContent("");
        }
    }

    function startEditComment(comment) {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
    }

    async function handleEditComment(commentId) {
        const res = await fetch(
            `/api/posts/${params.id}/comments/${commentId}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: editingContent }),
            }
        );
        if (res.ok) {
            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId ? { ...c, content: editingContent } : c
                )
            );
            setEditingCommentId(null);
            setEditingContent("");
        }
    }

    async function handleDeleteComment(commentId) {
        const res = await fetch(
            `/api/posts/${params.id}/comments/${commentId}`,
            {
                method: "DELETE",
            }
        );
        if (res.ok) {
            setComments((prev) => prev.filter((c) => c.id !== commentId));
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
                <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm">
                    <span>by {data.author}</span>
                </div>
                <p className="mb-6 text-gray-800 whitespace-pre-line">
                    {data.content}
                </p>
                <div className="flex gap-2 mb-4">
                    <Link href={`/post/${params.id}/edit`}>
                        <button className="px-4 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded">
                            수정
                        </button>
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                        삭제
                    </button>
                </div>
                <Link href="/" className="text-blue-600 hover:underline">
                    목록으로
                </Link>
            </div>
            <div className="bg-gray-50 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">댓글</h2>
                <ul className="space-y-3 mb-4">
                    {comments.map((comment) => (
                        <li
                            key={comment.id}
                            className="bg-white rounded p-3 flex flex-col sm:flex-row sm:items-center justify-between border"
                        >
                            <div className="flex-1">
                                <span className="font-semibold text-blue-600 mr-2">
                                    {comment.author}
                                </span>
                                {editingCommentId === comment.id ? (
                                    <>
                                        <input
                                            value={editingContent}
                                            onChange={(e) =>
                                                setEditingContent(
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded px-2 py-1 mr-2"
                                        />
                                        <button
                                            onClick={() =>
                                                handleEditComment(comment.id)
                                            }
                                            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded mr-1"
                                        >
                                            저장
                                        </button>
                                        <button
                                            onClick={() =>
                                                setEditingCommentId(null)
                                            }
                                            className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded"
                                        >
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-gray-800">
                                        {comment.content}
                                    </span>
                                )}
                            </div>
                            {comment.author === commentAuthor &&
                                editingCommentId !== comment.id && (
                                    <div className="flex gap-1 mt-2 sm:mt-0">
                                        <button
                                            onClick={() =>
                                                startEditComment(comment)
                                            }
                                            className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteComment(comment.id)
                                            }
                                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                )}
                        </li>
                    ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        placeholder="작성자"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        className="border rounded px-3 py-2 flex-1"
                    />
                    <input
                        type="text"
                        placeholder="댓글을 입력하세요"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="border rounded px-3 py-2 flex-1"
                    />
                    <button
                        onClick={handleAddComment}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                    >
                        댓글 작성
                    </button>
                </div>
            </div>
        </div>
    );
}
