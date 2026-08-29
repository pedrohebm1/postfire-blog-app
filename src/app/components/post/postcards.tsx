"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Postcard from "./card";

type Post = {
  id: number;
  bannerImage: string;
  title: string;
  createdAt: string;
  author_id: string;
  author: {
    username: string;
  };
};

export default function PostCards() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isReachedFinal, setReachedFinal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [hasHydrated, setHasHydrated] = useState<boolean>(false);
  const isFetchingRef = useRef(false);
  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  // 1. Hidratação e Leitura do Storage
  useEffect(() => {
    try {
      const savedPosts = sessionStorage.getItem("posts");
      const savedPage = sessionStorage.getItem("currentPage");
      const savedIsReachedFinal = sessionStorage.getItem("isReachedFinal");

      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
          setPosts(parsedPosts);
        }
      }
      
      if (savedPage) setCurrentPage(Number(savedPage));
      if (savedIsReachedFinal === "true") setReachedFinal(true);
    } catch (e) {
      console.error("Erro ao carregar do sessionStorage:", e);
      sessionStorage.clear();
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // 2. Gravação no Storage
  useEffect(() => {
    if (!hasHydrated) return;
    sessionStorage.setItem("posts", JSON.stringify(posts));
    sessionStorage.setItem("currentPage", currentPage.toString());
    sessionStorage.setItem("isReachedFinal", isReachedFinal.toString());
  }, [posts, currentPage, isReachedFinal, hasHydrated]);

  // 3. Função de Busca Ajustada
  const fetchPosts = useCallback(async (targetPage: number) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/range/${targetPage}`);
      
      if (!response.ok) {
        throw new Error(`Erro de rede: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.posts && data.posts.length > 0) {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newPosts = data.posts.filter((p: Post) => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });

        setCurrentPage(data.page);

        if (data.page >= data.totalPages) {
          setReachedFinal(true);
        }
      } else {
        setReachedFinal(true);
      }
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // 4. Disparo inicial após hidratação (Garantido)
  useEffect(() => {
    if (hasHydrated && posts.length === 0) {
      // Força a requisição da primeira página (0) se a lista estiver vazia
      setReachedFinal(false);
      fetchPosts(0);
    }
  }, [hasHydrated, posts.length, fetchPosts]);

  // 5. Scroll Infinito
  useEffect(() => {
    if (!hasHydrated || loading || isReachedFinal) return;

    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current && !isReachedFinal) {
          const nextPage = currentPage + 1;
          fetchPosts(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasHydrated, loading, isReachedFinal, currentPage, fetchPosts]);

  if (!hasHydrated) {
    return (
      <section className="flex flex-col gap-4 justify-center m-auto min-w-4/6 lg:w-7/12 pt-10 max-w-[700px]">
        <p className="text-center py-4 text-gray-400">Carregando...</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 justify-center m-auto min-w-4/6 lg:w-7/12 pt-10 max-w-[700px]">
      {posts.map((post) => (
        <Postcard settings={{ allowBanner: true }} key={post.id} post={post} />
      ))}

      {/* Âncora invisível para o IntersectionObserver */}
      {!isReachedFinal && <div ref={observerTargetRef} className="h-10 w-full" />}

      {loading && <p className="text-center py-4 text-gray-500">Carregando mais posts...</p>}
      {isReachedFinal && posts.length > 0 && (
        <p className="text-center py-4 text-gray-400">Você chegou ao fim dos posts.</p>
      )}
    </section>
  );
}