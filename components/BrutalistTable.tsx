import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface BrutalistTableProps<T> {
  columns: Column<T>[];
  data: T[];
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  searchKeys?: (keyof T)[];
  filterOptions?: {
    key: keyof T;
    options: { label: string; value: any }[];
    label?: string;
  }[];
  className?: string;
}

export function BrutalistTable<T extends Record<string, any>>({
  columns,
  data,
  page: controlledPage,
  pageSize: controlledPageSize = 10,
  total: controlledTotal,
  onPageChange,
  onPageSizeChange,
  searchKeys = [],
  filterOptions = [],
  className = '',
}: BrutalistTableProps<T>) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(controlledPageSize);

  // Nếu controlled, dùng props, nếu không thì dùng state nội bộ
  const currentPage = controlledPage !== undefined ? controlledPage : page;
  const currentPageSize = controlledPageSize !== undefined ? controlledPageSize : pageSize;
  const total = controlledTotal !== undefined ? controlledTotal : data.length;

  // Filtered & searched data
  const filteredData = useMemo(() => {
    let result = data;
    // Filter
    filterOptions.forEach(({ key }) => {
      if (filters[String(key)]) {
        result = result.filter((row) => String(row[String(key)]) === String(filters[String(key)]));
      }
    });
    // Search
    if (search && searchKeys.length > 0) {
      result = result.filter((row) =>
        searchKeys.some((key) =>
          String(row[String(key)] ?? '').toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    return result;
  }, [data, filters, search, filterOptions, searchKeys]);

  // Pagination
  const totalPages = Math.ceil(total / currentPageSize) || 1;
  // Nếu controlled thì không slice data, còn không thì slice như cũ
  const paginatedData = useMemo(() => {
    if (controlledPage !== undefined || controlledPageSize !== undefined || controlledTotal !== undefined) {
      // Server-side pagination: data đã là 1 trang
      return filteredData;
    } else {
      // Client-side pagination
      const start = (currentPage - 1) * currentPageSize;
      return filteredData.slice(start, start + currentPageSize);
    }
  }, [filteredData, currentPage, currentPageSize, controlledPage, controlledPageSize, controlledTotal]);

  // Handlers
  const handleFilterChange = (key: string, value: any) => {
    if (value === "__all__") {
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
    if (onPageChange) onPageChange(1);
    else setPage(1);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onPageChange) onPageChange(1);
    else setPage(1);
  };
  const handlePageChange = (newPage: number) => {
    if (onPageChange) onPageChange(newPage);
    else setPage(newPage);
  };
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    if (onPageSizeChange) onPageSizeChange(newSize);
    else {
      setPageSize(newSize);
      setPage(1);
    }
  };

  return (
    <div className={`${className}`}>
      <div className='flex gap-2 py-2'>
        {searchKeys.length > 0 && (
          <Input
            type='text'
            placeholder='Search...'
            value={search}
            onChange={handleSearchChange}
            className='brutalist-input font-bold'
          />
        )}
        {filterOptions.map((filter) => (
          <Select
            key={String(filter.key)}
            value={filters[String(filter.key)] ?? "__all__"}
            onValueChange={(value) => handleFilterChange(String(filter.key), value)}
          >
            <SelectTrigger className="brutalist-select bg-background text-foreground border-2 border-black rounded-none font-bold px-4 py-2 shadow-sm focus:outline focus:outline-2 focus:outline-primary transition w-48">
              <SelectValue placeholder={`All ${filter.label || String(filter.key)}`} />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-4 border-black rounded-none font-bold shadow-sm focus:outline focus:outline-2 focus:outline-primary transition'>
              <SelectItem value='__all__'>All {filter.label || String(filter.key)}</SelectItem>
              {filter.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
      <div className='brutalist-container'>
        <Table>
          <TableHeader className="bg-white border-b-4 border-black shadow-sm">
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className="border-b-4 border-black uppercase font-extrabold px-6 py-3 text-black bg-white rounded-none"
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className='text-center'>
                  No data
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, idx) => (
                <TableRow key={row.id || idx}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render
                        ? col.render(row)
                        : String(row[String(col.key)] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Pagination */}
        <div className='flex justify-between items-center mt-4'>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className='flex gap-2 items-center'>
            <button
              className='border px-2 py-1 rounded bg-white text-black disabled:opacity-50'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>
              Prev
            </button>
            <button
              className='border px-2 py-1 rounded bg-white text-black disabled:opacity-50'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}>
              Next
            </button>
            <select
              className='ml-2 border px-2 py-1 rounded bg-white text-black'
              value={currentPageSize}
              onChange={handlePageSizeChange}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>{size} / page</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 