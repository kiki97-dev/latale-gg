"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getFreeBoards } from "actions/free_boards-actions";
import PostContent from "./PostContent";
import { useSetRecoilState } from "recoil";
import { freeBoardsState } from "store/freeBoardState";
import { useEffect, useRef } from "react";
import PostContentSkeleton from "./PostContentSkeleton";
import { Post } from "types/post";

export default function FreeBoards() {
        const setFreeBoards = useSetRecoilState(freeBoardsState);
        const loaderRef = useRef<HTMLDivElement | null>(null);
        const PAGE_SIZE = 5;

        const freeBoardsQuery = useInfiniteQuery({
                queryKey: ["free_boards"],
                queryFn: ({ pageParam = 0 }) => getFreeBoards(pageParam, PAGE_SIZE),
                getNextPageParam: (lastPage, pages) =>
                        lastPage.length === PAGE_SIZE ? pages.length : undefined,
                initialPageParam: 0,
                staleTime: 1000 * 60 * 1, // 1분 동안 데이터를 신선한 상태로 유지
                refetchOnWindowFocus: false, // 다른 사이트 갔다 와도 다시 요청 X
                refetchOnMount: false, // 뒤로 가기로 돌아왔을 때 다시 요청 X
        });

        // Recoil 상태에 현재까지 로드된 게시글 저장
        useEffect(() => {
                if (freeBoardsQuery.data?.pages) {
                        const allPosts = freeBoardsQuery.data.pages.flat();
                        setFreeBoards(allPosts);
                }
        }, [freeBoardsQuery.data, setFreeBoards]);

        // Intersection Observer를 사용해 스크롤 하단에서 추가 게시글 로드
        useEffect(() => {
                const observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting && freeBoardsQuery.hasNextPage && !freeBoardsQuery.isFetchingNextPage) {
                                freeBoardsQuery.fetchNextPage();
                        }
                });

                const loader = loaderRef.current;
                if (loader) observer.observe(loader);

                return () => {
                        if (loader) observer.unobserve(loader);
                };
        }, [freeBoardsQuery]);

        return (
                <>
                        {freeBoardsQuery.isLoading && (
                                <>
                                        <PostContentSkeleton />
                                        <PostContentSkeleton />
                                        <PostContentSkeleton />
                                </>
                        )}
                        {freeBoardsQuery.data?.pages.map((page) =>
                                page.map((post) => <PostContent key={post.id} post={post as Post} />)
                        )}
                        {freeBoardsQuery.isFetchingNextPage && (
                                <>
                                        <PostContentSkeleton />
                                        <PostContentSkeleton />
                                        <PostContentSkeleton />
                                </>
                        )}
                        <div
                                ref={loaderRef}
                                className="h-1"
                                aria-hidden="true"
                        />
                </>
        );
}
