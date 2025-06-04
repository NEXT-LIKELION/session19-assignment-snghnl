import { NextResponse } from "next/server";
import { posts } from "../../../route";

export async function PATCH(request, { params }) {
    const post = posts.find((p) => p.id === parseInt(params.id));
    if (!post || !post.comments) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const comment = post.comments.find(
        (c) => c.id === parseInt(params.commentId)
    );
    if (!comment) {
        return NextResponse.json(
            { error: "Comment not found" },
            { status: 404 }
        );
    }
    const { content } = await request.json();
    if (content !== undefined) comment.content = content;
    return NextResponse.json(comment);
}

export async function DELETE(request, { params }) {
    const post = posts.find((p) => p.id === parseInt(params.id));
    if (!post || !post.comments) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const idx = post.comments.findIndex(
        (c) => c.id === parseInt(params.commentId)
    );
    if (idx === -1) {
        return NextResponse.json(
            { error: "Comment not found" },
            { status: 404 }
        );
    }
    const deleted = post.comments.splice(idx, 1)[0];
    return NextResponse.json(deleted);
}
