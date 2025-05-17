'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PostsFiltersProps {
  currentStatus: string;
  currentSort: string;
  searchQuery: string;
  onStatusChange: (status: string) => void;
  onSortChange: (sort: string) => void;
  onSearch: (query: string) => void;
}

export default function PostsFilters({
  currentStatus,
  currentSort,
  searchQuery,
  onStatusChange,
  onSortChange,
  onSearch,
}: PostsFiltersProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center">
      <div className="flex gap-3 w-full sm:w-auto">
        <Select value={currentStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="a-z">A-Z</SelectItem>
            <SelectItem value="z-a">Z-A</SelectItem>
            <SelectItem value="most-viewed">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex gap-2 w-full sm:w-auto sm:ml-auto"
      >
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="w-full pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
    </div>
  );
}