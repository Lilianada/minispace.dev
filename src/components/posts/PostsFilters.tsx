'use client';

import { useState, useEffect } from 'react';
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
  filters: {
    status: string;
    sort: string;
    search: string;
    category: string;
  };
  onFilterChange: (filters: Partial<{
    status: string;
    sort: string;
    search: string;
    category: string;
  }>) => void;
}

export default function PostsFilters({
  filters,
  onFilterChange
}: PostsFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);
  
  // Update local search input when filters change externally
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchInput });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({ sort: value });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({ category: value });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({
      status: 'all',
      sort: 'newest',
      search: '',
      category: 'all'
    });
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.sort !== 'newest' || 
    filters.search !== '' ||
    filters.category !== 'all';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex gap-3 w-full sm:w-auto">
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="notes">Notes</SelectItem>
              <SelectItem value="writings">Writings</SelectItem>
              <SelectItem value="drafts">Drafts</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sort} onValueChange={handleSortChange}>
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
      
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="text-xs"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
