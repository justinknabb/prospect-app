'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Call } from '@/lib/db';

interface CallFormProps {
  initialData?: Partial<Call>;
  prospects: { id: number; name: string }[];
  prospectId?: number;
  isEditing?: boolean;
}

export default function CallForm({ initialData, prospects, prospectId, isEditing = false }: CallFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Call>>(
    initialData || {
      prospect_id: prospectId || prospects[0]?.id || 1,
      notes: '',
      outcome: '',
      follow_up_date: '',
      follow_up_notes: '',
      completed: false,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'prospect_id' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEditing ? `/api/calls/${initialData?.id}` : '/api/calls';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save call');
      }

      if (prospectId) {
        router.push(`/prospects/${prospectId}`);
      } else {
        router.push('/calls');
      }
      router.refresh();
    } catch (error) {
      console.error('Error saving call:', error);
      alert('Failed to save call. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {!prospectId && (
          <div>
            <label htmlFor="prospect_id" className="block text-sm font-medium">
              Prospect *
            </label>
            <select
              id="prospect_id"
              name="prospect_id"
              required
              value={formData.prospect_id || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              {prospects.map((prospect) => (
                <option key={prospect.id} value={prospect.id}>
                  {prospect.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="notes" className="block text-sm font-medium">
            Call Notes *
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            required
            value={formData.notes || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="outcome" className="block text-sm font-medium">
            Call Outcome
          </label>
          <select
            id="outcome"
            name="outcome"
            value={formData.outcome || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Select an outcome</option>
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Call Back">Call Back</option>
            <option value="Left Message">Left Message</option>
            <option value="No Answer">No Answer</option>
            <option value="Wrong Number">Wrong Number</option>
          </select>
        </div>

        <div>
          <label htmlFor="follow_up_date" className="block text-sm font-medium">
            Follow-up Date
          </label>
          <input
            id="follow_up_date"
            name="follow_up_date"
            type="date"
            value={formData.follow_up_date || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="follow_up_notes" className="block text-sm font-medium">
            Follow-up Notes
          </label>
          <textarea
            id="follow_up_notes"
            name="follow_up_notes"
            rows={3}
            value={formData.follow_up_notes || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        {isEditing && (
          <div className="flex items-center">
            <input
              id="completed"
              name="completed"
              type="checkbox"
              checked={formData.completed || false}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="completed" className="ml-2 block text-sm font-medium">
              Mark as completed
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Call' : 'Log Call'}
        </button>
      </div>
    </form>
  );
}
