import { NextResponse } from "next/server";

export let posts = [];

export async function GET(request, { params }) {
    return NextResponse.json(posts);
}

export async function POST(request) {
    const { title, content, author } = await request.json();

    function getRandomNickname() {
        const adjectives = ["좋은", "멋진", "행복한", "행운의", "친절한"];
        const nouns = ["개발자", "코미디언", "엔지니어", "디자이너", "마케터"];
        const randomAdjective =
            adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${randomAdjective} ${randomNoun}`;
    }
    const nickname = author ? author : getRandomNickname();

    const newPost = {
        id: posts.length + 1,
        title,
        content,
        author: nickname,
        createdAt: new Date(),
    };
    posts.push(newPost);

    return NextResponse.json(newPost);
}
