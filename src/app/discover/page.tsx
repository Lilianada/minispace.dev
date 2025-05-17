'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/landing-page/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock data for illustration
// In a real application, you would fetch this from your database
const mockArticles = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Article ${i + 1}`,
    excerpt: `This is a brief description of article ${i + 1}...`,
    authorName: `Author ${(i % 10) + 1}`,
    dateCreated: new Date(2023, (i % 12), (i % 28) + 1).toISOString(),
}));

export default function ArticlesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 25;
    // const router = useRouter();

    // Filter articles based on search query
    const filteredArticles = mockArticles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get current articles for pagination
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    // Handle pagination
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <>
            <Navbar />
        <div className="container mx-auto px-4 py-8">
            
            <div className="my-8">
                <h1 className="text-3xl font-bold mb-4">Discover Articles</h1>
                <p className="text-lg mb-6">
                    Explore insightful posts from the minispace community. Find content on various topics
                    written by our talented authors.
                </p>
                
                <div className="relative mb-8">
                    <Input
                        type="text"
                        placeholder="Search articles by title, content or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-4"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {currentArticles.map((article) => (
                    <div key={article.id} className="border rounded-lg p-6 flex justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-semibold">{article.title}</h2>
                            <p className="text-gray-600 mt-2">{article.excerpt}</p>
                            <p className="text-sm text-gray-500 mt-auto">By {article.authorName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {new Date(article.dateCreated).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredArticles.length > articlesPerPage && (
                <div className="flex justify-center my-8">
                    <div className="flex space-x-2">
                        {Array.from({ length: Math.ceil(filteredArticles.length / articlesPerPage) }, (_, i) => (
                            <Button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                variant={currentPage === i + 1 ? "default" : "outline"}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
        </>
    );
}


// This page needs content

// This page is meant to display a list of posts made by minispace users that anyone can access and read whether or not they are authenticated.

// The posts will be listed out in a list formatted like this -

// left side (arranged in a column): title, exerpt, name of author,
// right side: date created,
// There'll be a navbar as well which is the same one used in the '/' page. It'll have a small introduction to the discover page of minispace and a search bar under the intro.

// The articles will have a pagination, 25 articles per pagination, the pagination doesn't open a new page, it reveals more posts.
// The search bar will be used to search for articles by title, content or author. The search bar will be a controlled component and will update the state of the articles displayed based on the search query.
// The articles will be fetched from the database and displayed in a list format. The articles will be paginated, 25 articles per page. The pagination will be done using the usePagination hook from react-query.
// This page is where all users who logout should be routed to because the current signout doesn't route users anywhere. So make sure after a successful signout, users will be routed to '/discover' page.