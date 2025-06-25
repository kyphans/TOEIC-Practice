"use client";
import React, { useEffect, useState } from 'react';
import { BrutalistTable } from '@/components/BrutalistTable';
import type { Question } from '@/types/questions.type';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / pageSize) || 1;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setError(null);
        const res = await fetch(`/api/questions?index=${pageIndex}&pageSize=${pageSize}`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        setQuestions(data.questions || []);
        setTotal(data.total || 0);
      } catch (e: any) {
        setError(e.message);
      }
    };
    fetchQuestions();
  }, [pageIndex, pageSize]);

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
  const sectionOptions = Array.from(new Set(questions.map((q) => q.sectionName)))
    .filter(Boolean)
    .map((name) => ({ label: String(name), value: name }));
  const typeOptions = Array.from(new Set(questions.map((q) => q.typeName)))
    .filter(Boolean)
    .map((name) => ({ label: String(name), value: name }));

  return (
    <div>
      <div className='brutalist-container'>
        <h1 className='text-2xl font-bold mb-4'>Questions List</h1>
      </div>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      
      <BrutalistTable
        columns={columns}
        data={questions}
        searchKeys={['content', 'correctAnswer', 'sectionName', 'typeName']}
        filterOptions={[
          { key: 'sectionName', options: sectionOptions, label: 'Section' },
          { key: 'typeName', options: typeOptions, label: 'Type' },
        ]}
        page={pageIndex}
        pageSize={pageSize}
        total={total}
        onPageChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(1);
        }}
      />
    </div>
  );
} 