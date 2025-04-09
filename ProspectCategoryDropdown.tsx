'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProspectCategoryDropdownProps {
  prospectId: number;
  currentCategoryId: number;
  categories: { id: number; name: string }[];
}

export default function ProspectCategoryDropdown({
  prospectId,
  currentCategoryId,
  categories,
}: ProspectCategoryDropdownProps) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(currentCategoryId);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = parseInt(e.target.value, 10);
    setCategoryId(newCategoryId);
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/prospects/${prospectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category_id: newCategoryId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating category:', error);
      setCategoryId(currentCategoryId); // Revert on error
      alert('Failed to update category. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center">
      <select
        value={categoryId}
        onChange={handleCategoryChange}
        disabled={isUpdating}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {isUpdating && (
        <div className="ml-2">
          <svg
            className="h-4 w-4 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}
