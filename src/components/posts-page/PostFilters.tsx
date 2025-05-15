import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PostFiltersProps {
  currentStatus: string;
  currentSort: string;
  onFilterChange: (status: string, sort: string) => void;
}

export default function PostFilters({
  currentStatus,
  currentSort,
  onFilterChange,
}: PostFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Status filter */}
      <Select
        value={currentStatus}
        onValueChange={(value) => onFilterChange(value, currentSort)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Posts</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Drafts</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort options */}
      <Select
        value={currentSort}
        onValueChange={(value) => onFilterChange(currentStatus, value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="updated">Recently Updated</SelectItem>
          <SelectItem value="title-asc">Title (A-Z)</SelectItem>
          <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          <SelectItem value="most-viewed">Most Viewed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}