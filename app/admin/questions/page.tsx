"use client";
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { BrutalistTable } from '@/components/BrutalistTable';
import type { Question } from '@/types/questions.type';
import { fetcher } from '@/lib/query';

export default function QuestionsPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, error, isLoading } = useSWR(
    `/api/questions?index=${pageIndex}&pageSize=${pageSize}`,
    fetcher
  );

  const questions: Question[] = data?.questions || [];
  const total: number = data?.total || 0;

  // Giữ lại previous data khi loading
  const [previousData, setPreviousData] = useState<{ questions: Question[]; total: number }>({ questions: [], total: 0 });

  useEffect(() => {
    if (data && data.questions) {
      setPreviousData({ questions: data.questions, total: data.total });
    }
  }, [data]);

  // Columns config for BrutalistTable
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'content', label: 'Content' },
    {
      key: 'choices',
      label: 'Choices',
      render: (q: Question) => q.choices?.join(', ')
    },
    { key: 'correctAnswer', label: 'Correct Answer' },
    { key: 'sectionName', label: 'Section Name' },
    { key: 'typeName', label: 'Type Name' },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (q: Question) => q.createdAt ? new Date(q.createdAt).toLocaleString() : '',
    },
  ];

  // Filter options (ví dụ: filter theo sectionName, typeName)
  const sectionOptions = Array.from(new Set((isLoading ? previousData.questions : questions).map((q) => q.sectionName)))
    .filter(Boolean)
    .map((name) => ({ label: String(name), value: name }));
  const typeOptions = Array.from(new Set((isLoading ? previousData.questions : questions).map((q) => q.typeName)))
    .filter(Boolean)
    .map((name) => ({ label: String(name), value: name }));

  return (
    <div>
      <div className='brutalist-container'>
        <h1 className='text-2xl font-bold mb-4'>Questions List</h1>
      </div>
      {error && <div className='text-red-500 mb-4'>{error.message}</div>}
      <BrutalistTable
        isLoading={isLoading}
        columns={columns}
        data={isLoading ? previousData.questions : questions}
        searchKeys={['content', 'correctAnswer', 'sectionName', 'typeName']}
        filterOptions={[
          { key: 'sectionName', options: sectionOptions, label: 'Section' },
          { key: 'typeName', options: typeOptions, label: 'Type' }
        ]}
        page={pageIndex}
        pageSize={pageSize}
        total={isLoading ? previousData.total : total}
        onPageChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(1);
        }}
      />
    </div>
  );
} 