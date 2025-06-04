import { NextResponse } from "next/server";
import { posts } from "../route";

export async function PATCH(request, { params }) {
    const { title, content } = await request.json();
    const post = posts.find((p) => p.id === parseInt(params.id));
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    return NextResponse.json(post);
}

export async function DELETE(request, { params }) {
    const idx = posts.findIndex((p) => p.id === parseInt(params.id));
    if (idx === -1) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const deleted = posts.splice(idx, 1)[0];
    return NextResponse.json(deleted);
}

// 댓글 API
export async function GET(request, { params }) {
    const post = posts.find((p) => p.id === parseInt(params.id));
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (!post.comments) post.comments = [];
    return NextResponse.json(post.comments);
}

export async function POST(request, { params }) {
    const post = posts.find((p) => p.id === parseInt(params.id));
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (!post.comments) post.comments = [];
    const { author, content } = await request.json();
    const newComment = {
        id: post.comments.length + 1,
        author,
        content,
        createdAt: new Date(),
    };
    post.comments.push(newComment);
    return NextResponse.json(newComment);
}
